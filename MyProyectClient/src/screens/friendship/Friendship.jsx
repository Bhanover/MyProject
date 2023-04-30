import React, { useState, useEffect } from "react";
import axios from "axios";

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
      console.log(response.data);
      updateFriends();
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div>
      <h2>Friendship</h2>
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