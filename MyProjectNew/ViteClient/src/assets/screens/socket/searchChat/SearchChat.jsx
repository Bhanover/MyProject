import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";
import PrivateChat from "../privateChat/PrivateChat";
import "./SearchChat.css"
import SocketTry from "../SocketTry";

function SearchChat() {
  const [connected, setConnected] = useState(false);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const stompClientRef = useRef(null);
  const [userInfo, setUserInfo] = useState({});
  const [roomName, setRoomName] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const jwtToken = localStorage.getItem("jwtToken");
  const userId = localStorage.getItem("idP");
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
        console.log(response.data.username)
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error.response.data);
        alert("Error al obtener la información del usuario. Inténtalo de nuevo.");
      }
    };
    fetchUserInfo();
  }, []);

  const connect = async () => {
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
          { sender: message.senderUsername, content: message.message },
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
  const handleSubmit = (e) => {
    e.preventDefault();
    handleConnect();
  };
  const handleConnect = () => {
    if (recipient) {
      setSelectedFriend({ username: recipient });
    }
  };
  return (
    <div  >
      {selectedFriend && (
        <PrivateChat
          selectedFriend={selectedFriend}
          minimized={minimized}
          setMinimized={setMinimized}
          onClose={() => setSelectedFriend(null)}
        />
      )}
      <div className="searchChatSC">
        <h1>Buscar usuario para chatear</h1>
        <form onSubmit={handleSubmit} className="searchChat-userSC">
          <div>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">Buscar</button>
          </div>
        </form>
        <div>
          <SocketTry />
        </div>
      </div>
    </div>
  );
}


export default SearchChat;