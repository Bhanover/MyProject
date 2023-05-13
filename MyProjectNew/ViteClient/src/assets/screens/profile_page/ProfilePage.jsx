import React, { useState, useEffect } from "react";
import UserProfile from "../user_profile/UserProfile";
import "./ProfilePage.css";
import { useParams, Outlet, useLocation } from "react-router-dom";

import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUpdated, setProfileImageUpdated] = useState(false);
  const currentUserId = localStorage.getItem("idP");
  const location = useLocation();

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const handleProfileImageUpdate = (newProfileImage) => {
    setProfileImage(newProfileImage);
    setProfileImageUpdated((prev) => !prev);
  };

  return (
    <div className="grid-containerPG">
      <div  className="containerPG"> 
      <div className="headerPG">
        <UserProfile
          userId={userId}
          currentUserId={currentUserId}
          profileImage={profileImage}
          onProfileImageUpdate={handleProfileImageUpdate}
          profileImageUpdated={profileImageUpdated}
        />
      </div>
      <div className="detailsPG">
        <div></div>
        <div className="contentPG">
          <div className="content-switchPG">
          <Link
  to={`/profilePage/${userId}/content`}
  className={isCurrentPath(`/profilePage/${userId}/content`) ? "active" : ""}
>
  Content
</Link>
<Link
  to={`/profilePage/${userId}/images`}
  className={isCurrentPath(`/profilePage/${userId}/images`) ? "active" : ""}
>
  Images
</Link>
<Link
  to={`/profilePage/${userId}/videos`}
  className={isCurrentPath(`/profilePage/${userId}/videos`) ? "active" : ""}
>
  Videos
</Link>
<Link
  to={`/profilePage/${userId}/publications`}
  className={
    isCurrentPath(`/profilePage/${userId}/publications`) ? "active" : ""
  }
>
  Publications
</Link>
<Link
  to={`/profilePage/${userId}/friends`}
  className={isCurrentPath(`/profilePage/${userId}/friends`) ? "active" : ""}
>
  Friends
</Link>

          </div>
          </div>
          </div>
          </div>
          <Outlet />
         
       
    </div>
  );
};

export default ProfilePage;