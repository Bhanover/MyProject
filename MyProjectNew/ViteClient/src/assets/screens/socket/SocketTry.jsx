import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from 'axios';
import jwt_decode from "jwt-decode";
function SocketTry() {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null); // Nuevo estado para el usuario actual
    const stompClientRef = useRef(null);
    const [userInfo, setUserInfo] = useState({});

   
    const jwtToken = localStorage.getItem('jwtToken');
  
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get('http://localhost:8081/api/auth/user/info', {
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
        <div className="App">
          {currentUser && connected ? (
            <div>
              <h2>Connected to WebSocket server</h2>
              <div>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message"
                />
                <button onClick={enviarMensaje}>Send</button>
              </div>
              <div>
                <h3>General chat</h3>
                <ul>
                  {messages.map((message, index) => (
                    <li key={index}>
                      <strong>{message.sender}: </strong>
                      {message.content}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <button onClick={disconnect}>Disconnect</button>
              </div>
            </div>
          ) : (
            <div>
              <h2>Not connected to WebSocket server</h2>
              <button onClick={connect}>Connect</button>
            </div>
          )}
        </div>
      );
          }
export default SocketTry;
