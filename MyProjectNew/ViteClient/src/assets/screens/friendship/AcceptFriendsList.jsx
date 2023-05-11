import "./AcceptedFriendsList.css"
function AcceptedFriendsList({ friends }) {
  

    return (
      <div className="accepted-FriendsListAFL">
        <h2>Accepted Friends List</h2>
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