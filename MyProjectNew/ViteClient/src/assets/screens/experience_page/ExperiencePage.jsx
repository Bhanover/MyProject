import React, { useState,useEffect } from "react";
import UserListSocket from "../socket/webSocketService/UserListSocket";
import "./ExperiencePage.css"
import FriendsContent from "../user_feed/FriendsContent";
import SearchChat from "../socket/searchChat/SearchChat";
const ExperiencePage = () => {
    return (
      <div className="experiencePageEXP">
        <div className="leftEXP">
        <SearchChat />
        </div>
        <div className="mainEXP"><FriendsContent /></div>
        <div className="user-list-containerEXP">
          <UserListSocket />
        </div>
      </div>
    );
  };
  export default ExperiencePage;