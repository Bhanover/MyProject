import "./AcceptedFriendsList.css"
/*Este componente recibe un array de friends como props*/
function AcceptedFriendsList({ friends }) {
  
/*Renderiza una lista de amigos cuya solicitud de amistad ha
 sido aceptada (es decir, friend.pending es false). 
 Cada amigo se representa con su imagen de perfil y su nombre de usuario.*/
    return (
      <div className="accepted-FriendsListAFL">
        <h2>Friends</h2>
        <div className="accepted-FriendsList-containerAFL"> 
        <ul>
          {friends
            .filter((friend) => !friend.pending)
            .map((acceptedFriend, index) => (
              <li key={`${acceptedFriend.id}-${index}`}>
                <img 
                  src={acceptedFriend.url} alt="profileImage">
                </img>
              {acceptedFriend.username}
                 
              </li>
            ))}
        </ul>
        </div>
      </div>
    );
  }
  
  export default AcceptedFriendsList;