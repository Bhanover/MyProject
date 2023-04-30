import Friendship from "./Friendship";
import FriendsList from "./FriendsList";
import React, { useState, useEffect,useCallback } from "react";
import RemoveFriend from "./RemoveFriend";
import axios from "axios";
import AcceptedFriendsList from "./AcceptFriendsList";
const FriendsPrincipal = (props) => {
  const [friends, setFriends] = useState([]);

  const fetchFriends = useCallback(async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await axios.get(`http://localhost:8081/api/auth/${props.userId}/friends`, config);
      setFriends(response.data);
      console.log("esto es el get ", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }, [props.userId]);

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div>
      <h1>Friends Principal</h1>
      <FriendsList friends={friends} fetchFriends={fetchFriends} userId={props.userId} />
      <AcceptedFriendsList friends={friends} />

    </div>
  );
};
  
  export default FriendsPrincipal;