import "./DetailsUser.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faMapMarkerAlt, faBriefcase, faGraduationCap, faVenusMars, faHeart, faUsers, faInfoCircle, faEdit } from '@fortawesome/free-solid-svg-icons'

const  DetailsUser= ({userId}) => {
  const [userInfo, setUserInfo] = useState({});
  const [updatedUser, setUpdatedUser] = useState({});
  const jwtToken = localStorage.getItem("jwtToken");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const currentUserId = localStorage.getItem("idP");

  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://localhost:8081/api/auth/user/${userId}/infoDetails`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setUserInfo(response.data);
        setUpdatedUser(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);

  const handleInputChange = (event) => {
    setUpdatedUser({...updatedUser, [event.target.name]: event.target.value});
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:8081/api/auth/user/infoDetails`, updatedUser, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then(response => {
      setUserInfo(updatedUser);
      console.log(response.data);
      alert("Sussesful Update!")
    })
    .catch(error => {
      console.error(error);
    });
  }

 
  return (
    <div className="user-infoDTU">
        <div className="user-detailsDTU"> 
      <h1>Details</h1>
      {currentUserId === userId && (
  <button type="button" onClick={() => setEditing(!editing)}>
    {editing ? (
      <>
         
        <FontAwesomeIcon icon={faEdit} />
      </>
    ) : (
      <>
        <FontAwesomeIcon icon={faEdit} />
      </>
    )}
  </button>
)}
        </div>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          
          <form onSubmit={handleSubmit}>
            <label>
              <FontAwesomeIcon icon={faUser} />
              {editing ? (
                <input name="firstName" value={updatedUser.firstName || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'} /> 
              ) : (
                <p>{userInfo.firstName}</p>
              )}
            </label>
            <label>
              <FontAwesomeIcon icon={faUser} />
              {editing ? (
                <input name="lastName" value={updatedUser.lastName || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'} /> 
              ) : (
                <p>{userInfo.lastName}</p>
              )}
            </label>
            <label>
              <FontAwesomeIcon icon={faVenusMars} />
              {editing ? (
                <select name="gender" value={updatedUser.gender || ''} onChange={handleInputChange}>
                  <option value="" disabled>Seleccionar Género</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              ) : (
                <p>{userInfo.gender}</p>
              )}
            </label>
            <label>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              {editing ? (
                <input name="currentLocation" value={updatedUser.currentLocation || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'} /> 
              ) : (
                <p>{userInfo.currentLocation}</p>
              )}
            </label>
            <label>
              <FontAwesomeIcon icon={faBriefcase} />
              {editing ? (
                <input name="workplace" value={updatedUser.workplace || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'} /> 
              ) : (
                <p>{userInfo.workplace}</p>
              )}
            </label>
            <label>
              <FontAwesomeIcon icon={faGraduationCap} />
              {editing ? (
                <input name="education" value={updatedUser.education || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'} /> 
              ) : (
                <p>{userInfo.education}</p>
              )}
            </label>
            <label>
              <FontAwesomeIcon icon={faUsers} />
              {editing ? (
                <select name="maritalStatus" value={updatedUser.maritalStatus || ''} onChange={handleInputChange}>
                  <option value="" disabled>Seleccionar Estado Civil</option>
                  <option value="soltero">Soltero</option>
                  <option value="casado">Casado</option>
                  <option value="divorciado">Divorciado</option>
                  <option value="viudo">Viudo</option>
                </select>
              ) : (
                <p>{userInfo.maritalStatus}</p>
              )}
            </label>
            <label>
              <FontAwesomeIcon icon={faHeart} />
              {editing ? (
                <textarea name="interests" value={updatedUser.interests || ''} onChange={handleInputChange} maxLength="500" className={editing ? '' : 'non-editing-input'} />
              ) : (
                <p>{userInfo.interests}</p>
              )}
            </label>
            {editing && (
            <button  type="submit">Actualizar</button>
          )}
        </form>
      </>
    )}
  </div>
);
};

export default DetailsUser;