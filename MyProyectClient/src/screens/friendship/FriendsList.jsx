// FriendsList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AcceptFriendship from "./AccepFriendship";
import RejectFriendship from "./RejectFriendship";
import RemoveFriend from "./RemoveFriend";
function FriendsList({ friends, fetchFriends }) {
    return (
      <div>
        <h2>Friends List</h2>
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>
              {friend.username}{" "}
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
            </li>
          ))}
        </ul>
      </div>
    );
  
  }
  
  export default FriendsList;