import React from 'react';
/*Recibe una notificación y una función markAsRead como props.*/
const NotificationItem = ({ notification, markAsRead }) => {
  /*Dentro de la renderización del componente, muestra el tipo y contenido de la notificación y la fecha de creación de la notificación.*/
  const { id, type, content, read, createdAt } = notification;

  return (
    /*Si la notificación no ha sido leída, muestra un botón que, 
    cuando se hace clic, llama a la función markAsRead con el id de la notificación.*/
    <div className={`notification-item ${read ? 'read' : 'unread'}`}>
      <div className="notification-type">{type}</div>
      <div className="notification-content">{content}</div>
      <div className="notification-date">{new Date(createdAt).toLocaleString()}</div>
      {!read && (
        <button onClick={() => markAsRead(id)}>
          viewed
        </button>
      )}
    </div>
  );
};

export default NotificationItem;