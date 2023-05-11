import React, { useState,useEffect } from "react";
import UserListSocket from "../socket/webSocketService/UserListSocket";
import "./ExperiencePage.css"
import FriendsContent from "../user_feed/FriendsContent";
const ExperiencePage = () => {
    return (
      <div className="experiencePageEXP">
        <div className="leftEXP">dasdasd</div>
        <div className="mainEXP"><FriendsContent /></div>
        <div className="user-list-containerEXP">
          <UserListSocket />
        </div>
      </div>
    );
  };
  export default ExperiencePage;