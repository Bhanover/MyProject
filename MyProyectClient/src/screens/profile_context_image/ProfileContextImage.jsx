import { createContext, useState, useContext } from "react";

const ProfileImageContext = createContext();

export const useProfileImage = () => {
  return useContext(ProfileImageContext);
};

export const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);

  return (
    <ProfileImageContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};