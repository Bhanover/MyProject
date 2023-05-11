import React, { useState, useEffect } from "react";
import UserProfile from "../user_profile/UserProfile";
import "./ProfilePage.css";
import { useParams, Outlet } from "react-router-dom";
import FriendsPrincipal from "../friendship/FriendsPrincipal";
import PublicationList from "../publication_list/PublicationList";
import UserContent from "../user_feed/UserContent";
import UserVideos from "../user_videos/UserVideos";
import FriendsContent from "../user_feed/FriendsContent";
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUpdated, setProfileImageUpdated] = useState(false);
  const currentUserId = localStorage.getItem("idP");

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
            <Link to={`/profilePage/${userId}/images`}>
              Images
            </Link>
            <Link to={`/profilePage/${userId}/videos`}>
              Videos
            </Link>
            <Link to={`/profilePage/${userId}/publications`}>
              Publications
            </Link>
            <Link to={`/profilePage/${userId}/content`}>
              Content
            </Link>
            <Link to={`/profilePage/${userId}/friends`}>
              Friends
            </Link>
            <Link to={`/profilePage/${userId}/friendsContent`}>
              Friends Content
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