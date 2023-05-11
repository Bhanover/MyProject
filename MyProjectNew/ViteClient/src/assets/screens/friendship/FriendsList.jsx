// FriendsList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AcceptFriendship from "./AccepFriendship";
import RejectFriendship from "./RejectFriendship";
import RemoveFriend from "./RemoveFriend";
import "./FriendsList.css";
function FriendsList({ friends, fetchFriends, userId }) {
  const loggedInUserId = localStorage.getItem("idP");

  return (
    <div className="accepted-FriendsListAFL">
       <h2>Friends List</h2>
       <div className="accepted-FriendsList-containerAFL"> 
      <ul>
        {friends.map((friend, index) => (
          <li key={`${friend.id}-${index}`}>
            
             <img 
            
                  src={friend.url} alt="profileImage">
                </img>
            {friend.username}{" "}
            {console.log({friend})}
            {loggedInUserId === userId && (
              <>
                {!friend.pending && (
                  <RemoveFriend
                    friendshipId={friend.friendshipId}
                    updateFriends={fetchFriends}
                  />
                )}
                {friend.pending && (
                  <>
                    <AcceptFriendship
                      friendshipId={friend.friendshipId}
                      updateFriends={fetchFriends}
                    />
                    <RejectFriendship
                      friendshipId={friend.friendshipId}
                      updateFriends={fetchFriends}
                    />
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default FriendsList;