// FriendsList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AcceptFriendship from "./AccepFriendship";
import RejectFriendship from "./RejectFriendship";
import RemoveFriend from "./RemoveFriend";
function FriendsList({ friends, fetchFriends, userId }) {
  const loggedInUserId = localStorage.getItem("idP");

  return (
    <div>
      <h2>Friends List</h2>
      <ul>
        {friends.map((friend, index) => (
          <li key={`${friend.id}-${index}`}>
            {friend.username}{" "}
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
  );
}

export default FriendsList;