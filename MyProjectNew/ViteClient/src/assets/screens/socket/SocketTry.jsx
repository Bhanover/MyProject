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
    const [currentUser, setCurrentUser] = useState(null); // Nuevo estado para el usuario actual
    const stompClientRef = useRef(null);
    const [userInfo, setUserInfo] = useState({});
    const handleSubmit = (e) => {
      e.preventDefault();
      enviarMensaje();
    };
   
    const jwtToken = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("idP");  
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

    const connect = () => {
      return new Promise((resolve, reject) => {
        const socket = new SockJS("http://localhost:8081/mywebsocket");
        stompClientRef.current = Stomp.over(socket);
        stompClientRef.current.connect({}, () => {
          console.log("CONNECTED TO SERVER");
           
          setConnected(true);
        
          // Enviar un mensaje al servidor WebSocket para informarle que el usuario ha iniciado sesión
          stompClientRef.current.send("/app/chat/login", {}, currentUser);
          
          stompClientRef.current.subscribe("/topic/chat/general", (response) => {
            console.log("golaaaaaaaaaaaaaaaaaaaaaaa")
            const message = JSON.parse(response.body);
            console.log("looooooooo recibo"+message)
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
  
    const disconnect = () => {
      if (window.confirm("Are you sure you want to disconnect?")) {
        if (stompClientRef.current !== null) {
          stompClientRef.current.disconnect();
          setConnected(false);
        }
      }
    };
  
    const enviarMensaje = () => {
      if (message.trim() !== "") {
        stompClientRef.current.send(
          "/app/chat/general",
          {},
          JSON.stringify({ message, sender: currentUser }) // Enviar el nombre de usuario del usuario actual en el mensaje
        );
        setMessage("");
      }
    };
  
    return (
        <div className="socketTryST">
          {currentUser && connected ? (
            <div>
              <h2>Conectado al Chat General</h2>
              
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
              <div className="socketTry-generalAllST">
          
                <form onSubmit={handleSubmit} className="socketTry-generalinfoST">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe algo..."
          />
          <button type="submit">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
          

              <div className="socketTry-disconnectST">
                <button onClick={disconnect}>x</button>
              </div>
             </div>
            </div>
          ) : (
            <div className="socketTry-generalST">
              <h3>Chat General</h3>
              <button onClick={connect}>Connect</button>
            </div>
          )}
        </div>
      );
          }
export default SocketTry;
