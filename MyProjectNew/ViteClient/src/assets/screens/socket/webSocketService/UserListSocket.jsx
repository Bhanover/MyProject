import React, { useEffect, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import PrivateChat from "../privateChat/PrivateChat";
import "./UserListSocket.css"
import { useNavigate } from "react-router-dom";

const UserListSocket = () => {
  const [users, setUsers] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");
  const idP = localStorage.getItem("idP");
  const [stompClient, setStompClient] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const navigate = useNavigate();

  const [chatWindows, setChatWindows] = useState([]);
  /* Esta función se llama cuando el usuario hace clic en un nombre de usuario en la lista*/
  const handleFriendClick = (user) => {
    const existingChat = chatWindows.find((chat) => chat.id === user.id);
    if (existingChat) {
      setChatWindows(chatWindows.filter((chat) => chat.id !== user.id));
    } else {
      setChatWindows([...chatWindows, user]);
    }
  };
  
  //Esta función  recupera la lista de amigos en línea del usuario
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
                isOnline: friend.online,
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
  /* Esta función actualiza el estado en línea de un usuario en la lista de usuarios.*/
  const updateUserStatus = (userId, isOnline) => {
    setUsers((users) =>
      users.map((user) => {
        if (user.id === parseInt(userId, 10)) {
          return { ...user, isOnline };
        } else {
          return user;
        }
      })
    );
  };
  /*Dentro del primer useEffect, se establece la conexión STOMP y se envía un mensaje al servidor para indicar que el usuario está en línea*/
  useEffect(() => {
    if (!jwtToken) {
      navigate("/loginPage");
    } else {
      getUsers();
      const socket = new SockJS("http://localhost:8081/mywebsocket");
      const client = Stomp.over(socket);
      setStompClient(client);
    }
  }, []);
  /*Dentro del segundo useEffect, se establecen dos suscripciones: 
  una para cuando un usuario se pone en línea y otra para cuando un 
  usuario se pone fuera de línea. Cada vez que se recibe un mensaje a
   través de estas suscripciones, se actualiza el estado en línea del usuario
    correspondiente y se obtiene la lista de usuarios nuevamente.*/
  useEffect(() => {
    if (stompClient) {
      stompClient.connect(
        { Authorization: jwtToken },
        (frame) => {
          stompClient.send("/app/online", { Authorization: jwtToken }, idP);
          
          stompClient.subscribe("/topic/online", (message) => {
            const userId = JSON.parse(message.body).userId;
            updateUserStatus(userId, true);
            getUsers();
          });
  
          stompClient.subscribe("/topic/offline", (message) => {
            const userId = JSON.parse(message.body).userId;
            updateUserStatus(userId, false);
            getUsers();
          });
        },
        (error) => {
          console.log("STOMP error: " + error);
        }
      );
    }
  }, [stompClient, jwtToken, idP, updateUserStatus, getUsers]);

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
      <h1>Contacts</h1>
 
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
