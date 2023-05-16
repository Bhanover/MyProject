import React, { useState } from 'react';
import PrivateChat from './PrivateChat';

function ChatContainer() {
  const [openChats, setOpenChats] = useState([]);
  
  const openChat = (friend) => {
    setOpenChats((prevChats) => [...prevChats, friend]);
  }

  const closeChat = (username) => {
    setOpenChats((prevChats) => prevChats.filter(chat => chat.username !== username));
  }

  return (
    <div className="chat-windows-container">
      {openChats.map((friend, index) => (
        <PrivateChat 
          key={friend.username} 
          selectedFriend={friend} 
          onClose={() => closeChat(friend.username)}
          style={{right: `${index * 350}px`}} // Cada chat se moverá 350px a la izquierda
        />
      ))}
    </div>
  );
}

export default ChatContainer;