import React, { useState, useEffect } from "react";
import axios from "axios";
import NotificationItem from "./NotificationItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import "./NotificationList.css";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");

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
      const updatedNotification = response.data; // Asume que el backend devuelve la notificación actualizada
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId ? updatedNotification : notification
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
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