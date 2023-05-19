import Friendship from "./Friendship";
import FriendsList from "./FriendsList";
import React, { useState, useEffect, useCallback } from "react";
import RemoveFriend from "./RemoveFriend";
import axios from "axios";
import AcceptedFriendsList from "./AcceptFriendsList";
import { useParams } from "react-router-dom";
import "./FriendsPrincipal.css"
/*: Este es el componente principal para la funcionalidad de amigos.*/
const FriendsPrincipal = () => {
  const [friends, setFriends] = useState([]);
  const { userId } = useParams();
  const currentUserId = localStorage.getItem("idP");
  const [loading, setLoading] = useState(true);
/* Utiliza la ID de usuario de los parámetros de la ruta para determinar 
 qué lista de amigos mostrar.*/
  const fetchFriends = useCallback(async () => {
    setLoading(true);
    
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await axios.get(`http://localhost:8081/api/auth/${userId}/friends`, config);
      setFriends(response.data);
      setLoading(false);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    fetchFriends();
  }, []);
/* Una vez cargados los datos, renderiza el componente AcceptedFriendsList 
con la lista de amigos y, si el usuario está viendo su propia lista de amigos, también el componente FriendsList.*/
  return (
    <div className="friendsPrincipalFP">
          {loading ? (
    
    <div className="loader-container">
    <div className="loader"></div>
    </div>
 
  ) : (
    <> 
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
      </>
  )}
    </div>
  );
};

export default FriendsPrincipal;