import React, { useState } from "react";
import axios from "axios";

function Friendship({ updateFriends }) {
  const [friendId, setFriendId] = useState("");

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

  return (
    <div>
      <h2>Send Friend Request</h2>
      <label htmlFor="friendId">Friend ID:</label>
      <input
        type="number"
        id="friendId"
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
      />
      <button onClick={sendFriendRequest}>Send Request</button>
    </div>
  );
}

export default Friendship;