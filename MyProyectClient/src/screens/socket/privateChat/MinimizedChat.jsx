import { useEffect, useRef, useState } from "react";


function MinimizedChat({ onClick, unreadMessages }) {
    useEffect(() => {
      console.log("Unread messages updated:", unreadMessages);
    }, [unreadMessages]);
  
    return (
      <div
        className="chat-window minimized-chat"
        onClick={onClick}
      >
        {unreadMessages > 0 && (
          <span className="unread-count">{unreadMessages}</span>
        )}
      </div>
    );
  }

  export default MinimizedChat