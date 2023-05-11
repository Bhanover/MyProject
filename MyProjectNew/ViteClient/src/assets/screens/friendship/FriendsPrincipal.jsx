import Friendship from "./Friendship";
import FriendsList from "./FriendsList";
import React, { useState, useEffect, useCallback } from "react";
import RemoveFriend from "./RemoveFriend";
import axios from "axios";
import AcceptedFriendsList from "./AcceptFriendsList";
import { useParams } from "react-router-dom";
import "./FriendsPrincipal.css"
const FriendsPrincipal = () => {
  const [friends, setFriends] = useState([]);
  const { userId } = useParams();
  const currentUserId = localStorage.getItem("idP");

  const fetchFriends = useCallback(async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await axios.get(`http://localhost:8081/api/auth/${userId}/friends`, config);
      setFriends(response.data);
      console.log("esto es el get ", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="friendsPrincipalFP">
      <div  className="friends-Principal-containerFP"> 
      <div>
        <AcceptedFriendsList friends={friends} />
        </div>
        <div> 
        {currentUserId === userId && (
          <FriendsList friends={friends} fetchFriends={fetchFriends} userId={userId} />
        )}
        </div>
         
      </div>
    </div>
  );
};

export default FriendsPrincipal;