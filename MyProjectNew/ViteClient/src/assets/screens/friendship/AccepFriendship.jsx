
import React from "react";
import axios from "axios";
/*Este componente recibe un friendshipId y una función updateFriends como props */
 function AcceptFriendship({ friendshipId, updateFriends }) {
  /*. Crea un botón que, al hacer click,
   realiza una petición PUT a la API para aceptar una solicitud de amistad. */
  const acceptFriendRequest = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      await axios.put(`http://localhost:8081/api/auth/accept/${friendshipId}`, {}, config);
      console.log("Friend request accepted successfully.");
      updateFriends();
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={acceptFriendRequest}>Accept</button>;
}

export default AcceptFriendship;
