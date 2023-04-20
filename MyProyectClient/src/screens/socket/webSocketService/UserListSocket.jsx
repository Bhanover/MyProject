import React, { useEffect, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const UserListSocket = () => {
  const [users, setUsers] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");
  const idP = localStorage.getItem("idP");
  const [stompClient, setStompClient] = useState(null);

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
          stompClient.send("/app/online", {}, idP);
  
          stompClient.subscribe("/topic/online", (message) => {
            const userId = JSON.parse(message.body).userId;
            console.log("Usuario en línea: " + userId);
            setUsers((users) =>
              users.map((user) => {
                if (user.id === userId) {
                  return { ...user, isOnline: true };
                } else {
                  return user;
                }
              })
            );
          });
  
          stompClient.subscribe("/topic/offline", (message) => {
            const userId = parseInt(JSON.parse(message.body).userId);
            console.log("Usuario fuera de línea: " + userId);
            setUsers((users) =>
              users.map((user) => {
                if (user.id === userId) {
                  return { ...user, isOnline: false };
                } else {
                  return user;
                }
              })
            );
          });
        },
        (error) => {
          console.log("STOMP error: " + error);
        }
      );
    }
   // Desconectar al desmontar el componente
   return () => {
    if (stompClient) {
      // Enviar mensaje de desconexión para informar al servidor que el usuario está fuera de línea
      stompClient.send("/app/offline", {}, idP);
      stompClient.disconnect();
    }
  };
}, [stompClient, jwtToken, idP]);

  
  return (
    <div>
      <h1>Lista de usuarios conectados</h1>
      {users && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username}{" "}
              {user.isOnline ? (
                <span style={{ color: "green" }}>(online)</span>
              ) : (
                <span style={{ color: "red" }}>(offline)</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay usuarios conectados.</p>
      )}
    </div>
  );
};

export default UserListSocket;