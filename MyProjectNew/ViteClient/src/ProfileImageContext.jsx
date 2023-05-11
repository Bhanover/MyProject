import React, { createContext, useState, useContext } from "react";

const ProfileImageContext = createContext();

export const useProfileImage = () => useContext(ProfileImageContext);

export const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);

  const updateProfileImage = (imageUrl) => {
    setProfileImage(imageUrl);
  };

  return (
    <ProfileImageContext.Provider value={{ profileImage, updateProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};
