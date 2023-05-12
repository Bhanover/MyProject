import React, { createContext, useState, useContext } from "react";

const ProfileImageContext = createContext();

export const useProfileImage = () => useContext(ProfileImageContext);

export const ProfileImageProvider = ({ children }) => {
  const defaultImageUrl = "https://res.cloudinary.com/dhqfopwka/image/upload/v1683919422/defaultImage/defaultAvatar_f4vs3m.jpg";
  const [profileImage, setProfileImage] = useState(defaultImageUrl);

  const updateProfileImage = (imageUrl) => {
    setProfileImage(imageUrl);
  };

  return (
    <ProfileImageContext.Provider value={{ profileImage, updateProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};