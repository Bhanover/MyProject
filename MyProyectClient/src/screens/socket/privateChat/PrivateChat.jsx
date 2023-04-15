import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";

function PrivateChat() {
  const [connected, setConnected] = useState(false);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const stompClientRef = useRef(null);
  const [userInfo, setUserInfo] = useState({});
  const [roomName, setRoomName] = useState(null);

  const jwtToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/auth/user/info", {
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
  }, [jwtToken]);

  const connect = async () => {
    if (recipient.trim() === "") {
      alert("Please enter recipient's username or ID");
      return;
    }
    
    const roomMembers = [currentUser, recipient].sort(); // Ordenar nombres de usuario
    const roomName = roomMembers.join("-"); 
    console.log("Room name: ", roomName);

    const socket = new SockJS("http://localhost:8081/mywebsocket");
    stompClientRef.current = Stomp.over(socket);
    await stompClientRef.current.connect({}, () => {
      console.log("CONNECTED TO SERVER");
      setConnected(true);
      console.log(`Subscribed to private chat room: ${roomName}`);
      stompClientRef.current.subscribe(`/queue/chat/private/${roomName}`, (response) => {
        console.log("Mensaje recibido: " + response.body);
        const message = JSON.parse(response.body);
        setPrivateMessages((prevMessages) => [
          ...prevMessages,
          { sender: message.sender, content: message.message },
        ]);
      });
    });
  };
 
  const disconnect = () => {
    if (window.confirm("Are you sure you want to disconnect?")) {
      if (stompClientRef.current !== null) {
        stompClientRef.current.disconnect();
        setConnected(false);
        setRoomName(null);
      }
    }
  };

  const enviarMensajePrivado = () => {
    const roomMembers = [currentUser, recipient].sort(); // Ordenar nombres de usuario
    const roomName = roomMembers.join("-"); 
    if (message.trim() !== "" && recipient.trim() !== "") {
      stompClientRef.current.send(
        "/app/chat/private",
        {},
        JSON.stringify({ message, senderId: currentUser, recipientId: recipient, roomName })
      );
      setMessage("");
    }
  };
  return (
    <div>
      {connected ? (
        <div>
          <h2>Private chat with {recipient}</h2>
          <button onClick={disconnect}>Disconnect</button>
          <div>
            {privateMessages.map((message, index) => (
              <p key={index}>
                {message.sender}: {message.content}
              </p>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={enviarMensajePrivado}>Send</button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Connect to private chat</h2>
          <div>
            <label htmlFor="recipient">Recipient:</label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <button onClick={connect}>Connect</button>
        </div>
      )}
    </div>
  );
      }

export default PrivateChat;