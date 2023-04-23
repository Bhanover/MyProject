import React, { useState } from "react";
import UserProfile from "../user_profile/UserProfile";
import UserImages from "../user_images/UserImages";
import UserVideos from "../user_videos/UserVideos";
import "./ProfilePage.css"
import LeftBar from "../left_bar/LeftBar";
import InfoLeft from "../info_left/InfoLeft";
import { useParams } from "react-router-dom";
import PublicationList from "../publication_list/PublicationList";
import UserContent from "../user_feed/UserContent";

const ProfilePage = () => {
  const [contentType, setContentType] = useState("images");
  const { userId } = useParams();
  return (
    <div className="grid-containerP">
      <div className="headerP">
      <UserProfile userId={userId} />
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
        </div>
        {contentType === "publications" && <PublicationList userId={userId}/>}
        {contentType === "images" && <UserImages userId={userId}/>}
        {contentType === "videos" && <UserVideos userId={userId}/>}
        {contentType === "content" && <UserContent userId={userId}/>}
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
