import React, { useState, useEffect } from "react";
import axios from "axios";
import AcceptFriendship from "./AccepFriendship";
import RejectFriendship from "./RejectFriendship";
import RemoveFriend from "./RemoveFriend";
import "./FriendsList.css";
/* Este componente recibe un array de amigos friends, 
una función fetchFriends para actualizar la lista de amigos 
y un userId para determinar a quién pertenece la lista de amigos*/
function FriendsList({ friends, fetchFriends, userId }) {
  const loggedInUserId = localStorage.getItem("idP");
/*Renderiza una lista de todos los amigos del usuario.
 Para cada amigo, muestra su imagen y nombre de usuario. 
 Si el usuario está viendo su propia lista de amigos, 
 se muestran botones adicionales dependiendo del estado de la amistad*/
  return (
    <div className="accepted-FriendsListAFL">
       <h2>Friends List</h2>
       <div className="accepted-FriendsList-containerAFL"> 
      <ul>
      {friends.map((friend, index) => (
  <li key={`${friend.id}-${index}`}>
    <img src={friend.url} alt="profileImage"></img>
    {friend.username}{" "}
       {loggedInUserId == userId && (
            <>
              {!friend.pending && (
                <RemoveFriend
                  friendshipId={friend.friendshipId}
                  updateFriends={fetchFriends}
                />
              )}
              {friend.pending && (
                <>
                  {friend.requesterId != loggedInUserId && (
                    <AcceptFriendship
                      friendshipId={friend.friendshipId}
                      updateFriends={fetchFriends}
                    />
                  )}
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