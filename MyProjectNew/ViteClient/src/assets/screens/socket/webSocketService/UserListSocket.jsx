import React, { useEffect, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import PrivateChat from "../privateChat/PrivateChat";
import "./UserListSocket.css"

const UserListSocket = () => {
  const [users, setUsers] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");
  const idP = localStorage.getItem("idP");
  const [stompClient, setStompClient] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [chatWindows, setChatWindows] = useState([]);

  const handleFriendClick = (user) => {
    if (chatWindows.some((chat) => chat.id === user.id)) {
      return;
    }
    setChatWindows([...chatWindows, user]);
  };
  const getUsers = async () => {
    try {
        const response = await axios.get("http://localhost:8081/mywebsocket/onlineFriends", {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          
          if (response.status === 200) {
            if (response.data && response.data.length > 0) {
              const onlineFriends = response.data.map((friend) => ({
                ...friend,
                isOnline: friend.online, // Asegúrate de que isOnline se establezca correctamente
              }));
              setUsers(onlineFriends);
            }
          } else {
            console.log("Error al obtener la lista de usuarios:", response);
          }
          
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  const updateUserStatus = (userId, isOnline) => {
    setUsers((users) =>
      users.map((user) => {
        if (user.id === parseInt(userId, 10)) { // Convierte userId en un número antes de la comparación
          return { ...user, isOnline };
        } else {
          return user;
        }
      })
    );
  };
  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/mywebsocket");
    const client = Stomp.over(socket);
    setStompClient(client);
  }, []);
  useEffect(() => {
    if (stompClient) {
      stompClient.connect(
        { Authorization: jwtToken },
        (frame) => {
          console.log("Conectado: " + frame);
          // Enviar mensaje de conexión para informar al servidor que el usuario está en línea
          stompClient.send("/app/online", { Authorization: jwtToken }, idP);
          
          // Obtener la lista de amigos en línea después de conectarse
          stompClient.subscribe("/topic/online", (message) => {
            const userId = JSON.parse(message.body).userId;
            console.log("Usuario en línea: " + userId);
            updateUserStatus(userId, true);
          });
          
  
          stompClient.subscribe("/topic/offline", (message) => {
            const userId = JSON.parse(message.body).userId;
            console.log("Usuario fuera de línea: " + userId);
            updateUserStatus(userId, false);
          });
        },
        (error) => {
          console.log("STOMP error: " + error);
        }
      );
    }
 
   // Desconectar al desmontar el componente
   })
   const handleDisconnect = () => {
    if (stompClient) {
      // Enviar mensaje de desconexión para informar al servidor que el usuario está fuera de línea
      stompClient.send("/app/offline", {}, idP);
      stompClient.disconnect();
    }
  };
  //<button onClick={handleDisconnect}>Desconectar</button>
  return (
    <div className="user-list-container">
      <h1>Contactos</h1>
 
      {users && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleFriendClick(user)}
              className="user"
            >
              {user.username}{" "}
              <span
                className="online-status"
                style={{ backgroundColor: user.isOnline ? "green" : "red" }}
              ></span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay usuarios conectados.</p>
      )}
      {chatWindows.map((user) => (
        <PrivateChat
          key={user.id}
          selectedFriend={user}
          onClose={() =>
            setChatWindows(chatWindows.filter((chat) => chat.id !== user.id))
        }
      />
    ))}
  </div>
);
  }
  export default UserListSocket;
