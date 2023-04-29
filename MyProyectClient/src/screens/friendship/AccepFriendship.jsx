
// AcceptFriendship.js
import React from "react";
import axios from "axios";

function AcceptFriendship({ friendshipId, updateFriends }) {
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
