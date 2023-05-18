import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogout = () => {
  const jwtToken = localStorage.getItem("jwtToken");
  const idP = localStorage.getItem("idP");
  const navigate = useNavigate();
  const [stompClient, setStompClient] = useState(null);

  /*Se utiliza el hook useEffect para establecer
   una conexión de WebSocket utilizando SockJS y StompJS*/
  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/mywebsocket");
    const client = Stomp.over(socket);
    setStompClient(client);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  /*se utiliza un segundo useEffect para desconectar la instancia de Stomp
  cuando el componente se desmonta.
*/
  useEffect(() => {
    const logout = async () => {
      try {
        if (stompClient) {
          stompClient.connect(
            { Authorization: jwtToken },
            (frame) => {
              stompClient.send("/app/offline", { Authorization: jwtToken }, idP);
            }
          );
        }
        /*Se realiza una solicitud POST a la ruta 
        para cerrar la sesión del usuario en el servidor.*/
        await axios.post(
          "http://localhost:8081/api/auth/signout",
          {},
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        // Elimina las credenciales almacenadas y redirige al usuario
        localStorage.removeItem("idP");
        localStorage.removeItem("jwtToken");
        navigate("/loginPage");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

    logout();
  }, [jwtToken, navigate, stompClient]);

  return (
    <div>
      <h2>Cerrando sesión...</h2>
    </div>
  );
};

export default UserLogout;
