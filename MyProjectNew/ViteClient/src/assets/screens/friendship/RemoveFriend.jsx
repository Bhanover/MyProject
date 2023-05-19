import React, { useState } from "react";
import axios from "axios";
/*Este componente permite eliminar a un amigo de la lista de amigos del usuario. */
const RemoveFriend = ({ friendshipId, updateFriends }) => {

  /*Cuando se hace clic en el botón "Remove Friend", se envía una petición DELETE a la API con la ID de la amistad.*/
    const handleRemoveFriend = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        const config = {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        };
        await axios.delete(
          `http://localhost:8081/api/auth/remove/${friendshipId}`,
          config
        );
        updateFriends();
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <button onClick={handleRemoveFriend}>
        Remove Friend
      </button>
    );
  };
  
  export default RemoveFriend;