import React, { useState } from "react";
import UserProfile from "../user_profile/UserProfile";
import UserImages from "../user_images/UserImages";
import UserVideos from "../user_videos/UserVideos";
import "./ProfilePage.css"
import LeftBar from "../left_bar/LeftBar";
import InfoLeft from "../info_left/InfoLeft";

const ProfilePage = () => {
  const [contentType, setContentType] = useState("images");

  return (
    <div className="grid-containerP">
    
      <div className="headerP">
        <UserProfile />
      </div>
      <div className="detailsP"> 
      <div className="infoleftP">
        <InfoLeft />
      </div>
      <div className="leftP">
        <LeftBar />
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
        </div>
        {contentType === "images" && <UserImages />}
        {contentType === "videos" && <UserVideos />}
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
