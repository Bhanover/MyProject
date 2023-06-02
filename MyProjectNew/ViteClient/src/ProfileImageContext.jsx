import React, { createContext, useState, useContext, useCallback } from "react";
 const ProfileImageContext = createContext();

export const useProfileImage = () => useContext(ProfileImageContext);
/*Este es un componente que proporciona el contexto de la imagen del perfil a cualquier componente hijo*/
 export const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);
/*Mantiene el estado de profileImage y proporciona una función updateProfileImage para actualizar este estado.*/
const updateProfileImage = useCallback((imageUrl) => {
  setProfileImage(imageUrl);
}, []);
/*Luego pasa profileImage y updateProfileImage a través del valor de Provider del ProfileImageContext.
 Cualquier componente hijo en el árbol de componentes ahora puede acceder a 
 profileImage y updateProfileImage usando el hook useContext*/
  return (
    <ProfileImageContext.Provider value={{ profileImage, updateProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};