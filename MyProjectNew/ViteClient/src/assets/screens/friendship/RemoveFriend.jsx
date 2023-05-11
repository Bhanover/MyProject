import React, { useState } from "react";
import axios from "axios";

const RemoveFriend = ({ friendshipId, updateFriends }) => {
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