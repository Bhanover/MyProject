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
      await axios.put(
        `http://localhost:8081/api/auth/read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const updatedNotifications = notifications.filter(
        (notification) => notification.id !== notificationId
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
      <div className="notification-list">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            markAsRead={markNotificationAsRead}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;