import React, { useState, useEffect } from "react";
import axios from "axios";
import NotificationItem from "./NotificationItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import "./NotificationList.css";
import { useNavigate } from "react-router-dom";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  /*fetchNotifications se utiliza para obtener las notificaciones */
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/auth/notification", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  /*markNotificationAsRead se utiliza para marcar una notificación específica como leída.*/
  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/auth/read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const updatedNotification = response.data; 
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId ? updatedNotification : notification
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error(error);
    }
  };
  /*fetchNotifications una vez que el componente se ha renderizado.
   Si no hay un token JWT almacenado localmente, redirige al usuario a la página de inicio de sesión.*/
  useEffect(() => {
    if (!jwtToken) {
      navigate("/loginPage");
    } else {
      fetchNotifications();
    }
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="notification-container">
      <div className="notification-icon">
        <FontAwesomeIcon icon={faGlobe} />
        {unreadCount > 0 && <span className="notification-counter">{unreadCount}</span>}
      </div>
      {notifications.length > 0 && (
        <div className="notification-list">
          {notifications
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                markAsRead={markNotificationAsRead}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;