import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Friendship.css";
/*: Este componente maneja el envío de solicitudes de amistad y la visualización de su estado. */
function Friendship({ friendId, updateFriends, disabled }) {
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [sentRequest, setSentRequest] = useState(null);
   const sendFriendRequest = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      updateFriends();
      const response = await axios.post(
        `http://localhost:8081/api/auth/request/${friendId}`,
        {},
        config
      );
      updateFriends();
    } catch (error) {
      console.error(error);
    }
  };
  /*Al montar el componente o cuando friendId cambia, se realiza una petición GET*/

  const checkFriendshipStatus = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await axios.get(
        `http://localhost:8081/api/auth/friendship-status/${friendId}`,
        config
      );
      const friendship = response.data;
      /* Si existe una relación de amistad, se actualizan friendshipStatus
       y sentRequest; si no, ambos se establecen en null*/
      if (friendship) {
        setFriendshipStatus(friendship.status);
        const loggedInUserId = localStorage.getItem("idP");
        if (friendship.requesterId == loggedInUserId) {
          setSentRequest(true);
        } else {
          setSentRequest(false);
        }
      } else {
        setFriendshipStatus(null);
        setSentRequest(null);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    checkFriendshipStatus();
  }, [friendId]);
/*El componente renderiza un botón "Send Request" si no existe una relación de amistad, un mensaje
 sobre el estado de la solicitud si está pendiente y un mensaje de confirmación si la solicitud ha sido aceptada.*/
  return (
    <div className="friendsShipFDS">
      {friendshipStatus === null && (
        <button onClick={sendFriendRequest} disabled={disabled}>
          Send Request
        </button>
      )}
      {friendshipStatus === "PENDING" && (
        <p>
          {sentRequest
            ? "Friend request sent. Waiting for a response."
            : "Friend request received. Check your notifications to respond."}
        </p>
      )}
      {friendshipStatus === "ACCEPTED" && <p>You are friends.</p>}
    </div>
  );
}

export default Friendship;