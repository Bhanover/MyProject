import React, { useState, useEffect } from "react";
import UserListSocket from "../socket/webSocketService/UserListSocket";
import "./ExperiencePage.css"
import FriendsContent from "../user_feed/FriendsContent";
import SearchChat from "../socket/searchChat/SearchChat";

const ExperiencePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1300);
  const [isSmallerScreen, setIsSmallerScreen] = useState(window.innerWidth <= 800);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1300);
      setIsSmallerScreen(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserList = () => {
    setIsUserListOpen(!isUserListOpen);
  };

  return (
    <div className="experiencePageEXP">
      {isSmallScreen && (
        <button className="menuButton" onClick={toggleMenu}>{`\u2192`}</button>
      )}
      {isSmallerScreen && (
        <button className="userListButton" onClick={toggleUserList}>{`\u2190`}</button>
      )}
      <div className={`leftEXP ${isMenuOpen ? "open" : ""}`}>
        <SearchChat />
      </div>
      <div className="mainEXP"><FriendsContent /></div>
      <div className={`user-list-containerEXP ${isUserListOpen ? "open" : ""}`}>
        <UserListSocket />
      </div>
    </div>
  );
};

export default ExperiencePage;
