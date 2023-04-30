function AcceptedFriendsList({ friends }) {
    return (
      <div>
        <h2>Accepted Friends List</h2>
        <ul>
          {friends
            .filter((friend) => !friend.pending)
            .map((acceptedFriend, index) => (
              <li key={`${acceptedFriend.id}-${index}`}>
                {acceptedFriend.username}
              </li>
            ))}
        </ul>
      </div>
    );
  }
  
  export default AcceptedFriendsList;