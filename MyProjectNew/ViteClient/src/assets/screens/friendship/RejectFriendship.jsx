import React from "react";
import axios from "axios";
/*Este componente recibe un friendshipId y una función updateFriends como props*/
function RejectFriendship({ friendshipId, updateFriends }) {
  /* Crea un botón que, al hacer click, realiza una petición PUT a la API para rechazar una solicitud de amistad.*/
  const rejectFriendRequest = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      await axios.put(`http://localhost:8081/api/auth/reject/${friendshipId}`, {}, config);
      console.log("Friend request rejected successfully.");
      updateFriends();
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={rejectFriendRequest}>Reject</button>;
}

export default RejectFriendship;