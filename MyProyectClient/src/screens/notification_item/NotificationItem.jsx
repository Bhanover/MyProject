import React from 'react';

const NotificationItem = ({ notification, markAsRead }) => {
  const { id, type, content, read, createdAt } = notification;

  return (
    <div className={`notification-item ${read ? 'read' : 'unread'}`}>
      <div className="notification-type">{type}</div>
      <div className="notification-content">{content}</div>
      <div className="notification-date">{new Date(createdAt).toLocaleString()}</div>
      {!read && (
        <button onClick={() => markAsRead(id)}>
          Mark as read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;