import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";
import "./PrivateChat.css"

function PrivateChat({ selectedFriend, onClose }) {
  const [connected, setConnected] = useState(false);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState(selectedFriend ? selectedFriend.username : "");
  const [currentUser, setCurrentUser] = useState(null);
  const stompClientRef = useRef(null);
  const [userInfo, setUserInfo] = useState({});
  const [roomName, setRoomName] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  const jwtToken = localStorage.getItem("jwtToken");
  const userId = localStorage.getItem("idP");
  /*Se obtiene la información del usuario logueado*/
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/auth/user/${userId}/info`, {
          
          headers: {
            Authorization: "Bearer " + jwtToken,
          },
        });
        setUserInfo(response.data);
        setCurrentUser(response.data.username);
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error.response.data);
        alert("Error al obtener la información del usuario. Inténtalo de nuevo.");
      }
    };
    fetchUserInfo();
  }, []);
  /*El segundo useEffect se encarga de manejar la conexión y desconexión a partir de la selección de un amigo para chatear.*/
  useEffect(() => {
    if (selectedFriend && currentUser) {
      connect();
    } else if (!selectedFriend) {
      disconnect();
    }
  }, [selectedFriend, currentUser]);

  /* Este método se utiliza para establecer una conexión con el servidor de WebSockets utilizando las bibliotecas SockJS y StompJS. 
  Crea una sala de chat basándose en los nombres de usuario y suscribe al cliente a esa sala de chat. */
  const connect = async () => {
    const roomMembers = [currentUser, recipient].sort(); // Ordenar nombres de usuario
    const roomName = roomMembers.join("-"); 
    console.log("Room name: ", roomName);

    const socket = new SockJS("http://localhost:8081/mywebsocket");
    stompClientRef.current = Stomp.over(socket);
    await stompClientRef.current.connect({}, () => {
      setConnected(true);
      /*También maneja la recepción de mensajes y actualiza el estado de privateMessages con cada nuevo mensaje.*/
      stompClientRef.current.subscribe(`/queue/chat/private/${roomName}`, (response) => {
        const message = JSON.parse(response.body);
        setPrivateMessages((prevMessages) => [
          ...prevMessages,
          { sender: message.senderUsername, content: message.message },
        ]);
      });
    
      // Cargar el historial de chat
      loadChatHistory();
    });
  };
  useEffect(() => {
    if (minimized) {
  setUnreadMessages((prevUnreadMessages) => prevUnreadMessages + 1);
    }
  }, [privateMessages]);
  const fetchPrivateMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/mywebsocket/privateMessages?senderId=${currentUser}&recipientId=${recipient}`, {
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
      });
      setPrivateMessages(response.data.map(pm => ({ sender: pm.senderUsername, content: pm.message })));
    } catch (error) {
      console.error("Error al obtener los mensajes privados:", error.response.data);
      alert("Error al obtener los mensajes privados. Inténtalo de nuevo.");
    }
  };
  /* Este método hace una petición a la API para obtener el historial de chat y luego establece el estado de privateMessages con la respuesta.*/
  const loadChatHistory = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8081/mywebsocket/chat/private/history/${recipient}`, {
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
      });
  
      setPrivateMessages(
        response.data.map((msg) => ({
          sender: msg.senderUsername,
          content: msg.message,
        }))
      );
      setLoading(false);

    } catch (error) {
      console.error("Error al cargar el historial de chat:", error);
    }
  };
  /*Este método desconecta al cliente del servidor WebSocket y resetea la información relevante.*/
  const disconnect = () => {
    if (stompClientRef.current !== null) {
      stompClientRef.current.disconnect();
      setConnected(false);
      setRoomName(null);
    }
  };
  /*Este método envía un mensaje privado a través de la conexión de WebSocket. */
  const enviarMensajePrivado = (e) => {
    e.preventDefault();
    const roomMembers = [currentUser, recipient].sort(); // Ordenar nombres de usuario
    const roomName = roomMembers.join("-"); 
    if (message.trim() !== "" && recipient.trim() !== "") {
      stompClientRef.current.send(
        "/app/chat/private",
        {},
        JSON.stringify({
          message,
          senderId: currentUser,
          senderUsername: userInfo.username,
          recipientId: recipient,
          roomName,
        })
      );
      setMessage("");
    }
  };

  /*Varios elementos en el renderizado tienen eventos onClick 
  que manejan acciones como minimizar la ventana de chat, cerrar la ventana de chat y enviar un mensaje.*/
  return (
    <>
     {minimized ? (
    <div
      className="chat-window minimized-chat"
      onClick={() => {
        setMinimized(false);
        setUnreadMessages(0); // Restablece el recuento de mensajes no leídos
      }}
    >
      {recipient.charAt(0)}
      {unreadMessages > 0 && <span className="unread-count">{unreadMessages}</span>}
    </div>
  ) : (
        <div className="chat-window">
           {loading ? (
  
        <div className="spinnerContact"></div>
        
      ) : (
        <>
          <div className="chat-header">
            <span>Private chat with {recipient}</span>
            <div>
              <span
                className="minimize-button"
                onClick={() => setMinimized(true)}
              >
                -
              </span>
              <span className="close-button" onClick={() => { onClose(); disconnect(); }}>
            &times;
          </span>
            </div>
          </div>
          <div className="chat-content">
            {privateMessages.map((message, index) => (
              <p key={index}>
                <span className={message.sender === currentUser ? "sender" : "receiver"}>
                  {message.sender}: {message.content}
                </span>
              </p>
            ))}
          </div>
          <form onSubmit={enviarMensajePrivado} className="input-wrapper">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something"
          />
          <button type="submit">Send</button>
        </form>
         </>
        )}
        </div>
        
      )}
    </>
  );
}

export default PrivateChat;