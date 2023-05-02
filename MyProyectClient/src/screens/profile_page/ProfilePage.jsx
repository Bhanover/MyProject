import React, { useState,useEffect } from "react";
import UserProfile from "../user_profile/UserProfile";
import UserImages from "../user_images/UserImages";
import UserVideos from "../user_videos/UserVideos";
import "./ProfilePage.css"

import { useParams } from "react-router-dom";
import PublicationList from "../publication_list/PublicationList";
import UserContent from "../user_feed/UserContent";
import NotificationList from "../notification_item/NotificationList";
import FriendsPrincipal from "../friendship/FriendsPrincipal";
const ProfilePage = () => {
  const [contentType, setContentType] = useState("images");
  const { userId } = useParams();
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUpdated, setProfileImageUpdated] = useState(false);
  const currentUserId = localStorage.getItem("idP");

  const handleProfileImageUpdate = (newProfileImage) => {
    setProfileImage(newProfileImage);
    setProfileImageUpdated((prev) => !prev);
  };
  useEffect(() => {
    setContentType("images");
  }, [userId]);
  return (
    <div className="grid-containerP">
         <div className="headerP">
         <UserProfile
          userId={userId}
          currentUserId={currentUserId}
          profileImage={profileImage}
          onProfileImageUpdate={handleProfileImageUpdate}
          profileImageUpdated={profileImageUpdated}
        />      
        </div>
      <div className="detailsP"> 
    
      <div>
      <NotificationList  />

      </div>
      <div className="contentP">
        <div className="content-switch">
          <button
            onClick={() => setContentType("images")}
            className={contentType === "images" ? "button-active" : ""}
          >
            Images
          </button>
          <button
            onClick={() => setContentType("videos")}
            className={contentType === "videos" ? "button-active" : ""}
          >
            Videos
          </button>
          <button
            onClick={() => setContentType("publications")}
            className={contentType === "publications" ? "button-active" : ""}
          >
            Publications
          </button>
          <button
            onClick={() => setContentType("content")}
            className={contentType === "content" ? "button-active" : ""}
          >
            content
          </button>
          <button
            onClick={() => setContentType("friends")}
            className={contentType === "friends" ? "button-active" : ""}
          >
            friends
          </button>
        </div>
        {contentType === "publications" && <PublicationList userId={userId}/>}
        {contentType === "images" && <UserImages userId={userId} onProfileImageUpdate={handleProfileImageUpdate} />}
        {contentType === "videos" && <UserVideos userId={userId}/>}
        {contentType === "content" && <UserContent userId={userId}/>}
        {contentType === "friends" && <FriendsPrincipal userId={userId}/>}
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
