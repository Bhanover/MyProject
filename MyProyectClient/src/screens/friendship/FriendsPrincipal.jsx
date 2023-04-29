import Friendship from "./Friendship";
import FriendsList from "./FriendsList";
import React, { useState, useEffect,useCallback } from "react";
import RemoveFriend from "./RemoveFriend";
import axios from "axios";

const FriendsPrincipal = () => {
    const [friends, setFriends] = useState([]);
    const fetchFriends = useCallback(async () => {
        try {
          const jwtToken = localStorage.getItem("jwtToken");
          const config = {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          };
          const response = await axios.get("http://localhost:8081/api/auth/friends", config);
          setFriends(response.data);
          console.log(response.data)
          return response.data;
        } catch (error) {
          console.error(error);
        }
      }, []);

    
      useEffect(() => {
        fetchFriends();
      }, []);
    return (
        <div>
          <h1>Friends Principal</h1>
          <Friendship updateFriends={fetchFriends} />
          <FriendsList friends={friends} fetchFriends={fetchFriends} />
          <RemoveFriend updateFriends={fetchFriends} />
        </div>
      );
    };
    
    export default FriendsPrincipal;