// RejectFriendship.js
import React from "react";
import axios from "axios";

function RejectFriendship({ friendshipId, updateFriends }) {
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