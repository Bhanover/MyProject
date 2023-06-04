import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import "./SocketTry.css"
function SocketTry() {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const stompClientRef = useRef(null);
    const [userInfo, setUserInfo] = useState({});
    /*Este método maneja el evento de envío del formulario, que dispara el método enviarMensaje.*/
    const handleSubmit = (e) => {
      e.preventDefault();
      enviarMensaje();
    };
   
    const jwtToken = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("idP");  
    /*En este método se recupera la información del usuario*/
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/api/auth/user/${userId}/info`, {
            headers: {
              Authorization: 'Bearer ' + jwtToken
            }
          });
          setUserInfo(response.data);
          setCurrentUser(response.data.username)
        } catch (error) {
          console.error('Error al obtener la información del usuario:', error.response.data);
          alert('Error al obtener la información del usuario. Inténtalo de nuevo.');
        }
      };
      fetchUserInfo();
    }, [jwtToken]);
    /* Este método crea una conexión WebSocket al servidor */
    const connect = () => {
      return new Promise((resolve, reject) => {
        const socket = new SockJS("http://localhost:8081/mywebsocket");
        stompClientRef.current = Stomp.over(socket);
        stompClientRef.current.connect({ Authorization: jwtToken }, () => {

           
          setConnected(true);
        
          // Enviar un mensaje al servidor WebSocket para informarle que el usuario ha iniciado sesión
          stompClientRef.current.send("/app/chat/login", {}, currentUser);
            /*se suscribe a un canal de chat general y maneja la recepción de mensajes*/
          stompClientRef.current.subscribe("/topic/chat/general", (response) => {
            const message = JSON.parse(response.body);
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: message.sender, content: message.message },
            ]);
          });
          resolve();
        }, (error) => {
          reject(error);
        });
      });
    };
    /*Este método desconecta la conexión WebSocket y actualiza el estado connected a false.*/
    const disconnect = () => {
     
        if (stompClientRef.current !== null) {
          stompClientRef.current.disconnect();
          setConnected(false);
        }
      
    };
  
    const enviarMensaje = () => {
      if (message.trim() !== "") {
        stompClientRef.current.send(
          "/app/chat/general",
          {},
          JSON.stringify({ message, sender: currentUser }) // Envia el nombre de usuario del usuario actual en el mensaje
        );
        setMessage("");
      }
    };
  
    return (
        <div className="socketTryST">
          {currentUser && connected ? (
            <div>
                   <div className="socketTry-disconnectST">
                <button onClick={disconnect}>x</button>
              </div>
              <h2>Connected to General Chat</h2>
              
              <div className="socketTry-generalchatST">
                <ul>
                  {messages.map((message, index) => (
                    <li key={index}>
                      <strong>{message.sender}: </strong>
                      {message.content}
                    </li>
                  ))}
                </ul>
                
              </div>
          
          
          <form onSubmit={handleSubmit} className="socketTry-generalinfoST">
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Write something..."
    />
    <button type="submit">
      <FontAwesomeIcon icon={faPaperPlane} />
    </button>
  </form>
    

    
       
            </div>
          ) : (
            <div className="socketTry-generalST">
              <h3>General Chat</h3>
              <button onClick={connect}>Connect</button>
            </div>
          )}
        </div>
      );
          }
export default SocketTry;
