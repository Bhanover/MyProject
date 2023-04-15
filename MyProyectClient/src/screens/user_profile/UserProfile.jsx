// PrivateChat.js
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

function PrivateChat({ senderId, recipientId, onClose }) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const stompClientRef = useRef(null);

  const connect = () => {
    return new Promise((resolve, reject) => {
      const socket = new SockJS("http://localhost:8081/mywebsocket");
      stompClientRef.current = Stomp.over(socket);
      stompClientRef.current.connect({}, () => {
        console.log("CONNECTED TO SERVER");

        setConnected(true);

        stompClientRef.current.subscribe(
          `/topic/chat/private/${senderId}-${recipientId}`,
          (response) => {
            const message = JSON.parse(response.body);
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: message.sender, content: message.message },
            ]);
          }
        );
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  };

  useEffect(() => {
    connect();
    return () => {
      if (stompClientRef.current !== null) {
        stompClientRef.current.disconnect();
      }
    };
  }, []);

  const enviarMensaje = () => {
    if (message.trim() !== "") {
      stompClientRef.current.send(
        `/app/chat/private/${senderId}-${recipientId}`,
        {},
        JSON.stringify({ message, sender: senderId })
      );
      setMessage("");
    }
  };

  return (
    <div className="private-chat">
      <h2>Private Chat with {recipientId}</h2>
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
        <h3>Private chat</h3>
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
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default PrivateChat;