import "./DetailsUser.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBirthdayCake, faMapMarkerAlt, faBriefcase, faGraduationCap, faVenusMars, faHeart, faUsers, faInfoCircle, faEdit } from '@fortawesome/free-solid-svg-icons'

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
      setEditing(false);
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
                <input name="firstName" value={updatedUser.firstName || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'} placeholder="firstName" /> 
              ) : (
              <p className={userInfo.firstName ? '' : 'placeholder-text'}>
                {userInfo.firstName || 'Add your first name.'}
              </p>              
              )}
            </label>
            <label>
              <FontAwesomeIcon icon={faUser} />
              {editing ? (
                <input name="lastName" value={updatedUser.lastName || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'}  placeholder="lastName" /> 
              ) : (
                <p className={userInfo.lastName ? '' : 'placeholder-text'}>
                  {userInfo.lastName || 'Add your last name.'}
                </p>             
                )}
            </label>
            <label>
              <FontAwesomeIcon icon={faVenusMars} />
              {editing ? (
                <select name="gender" value={updatedUser.gender || ''} onChange={handleInputChange}  placeholder="gender" >
                  <option value="" disabled>Select gender</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              ) : (
                <p className={userInfo.gender ? '' : 'placeholder-text'}>
                  {userInfo.gender || 'Select your gender.'}
                </p>             
                )}
            </label>
            <label>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              {editing ? (
                <input name="currentLocation" value={updatedUser.currentLocation || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'}  placeholder="location"  /> 
              ) : (
              <p className={userInfo.currentLocation ? '' : 'placeholder-text'}>
                {userInfo.currentLocation || 'Add your current location.'}
              </p>             
              )}
            </label>
            <label>
              <FontAwesomeIcon icon={faBriefcase} />
              {editing ? (
                <input name="workplace" value={updatedUser.workplace || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'}  placeholder="workPlace" /> 
              ) : (
                  <p className={userInfo.workplace ? '' : 'placeholder-text'}>
                    {userInfo.workplace || 'Add your workplace.'}
                  </p>              
                  )}
            </label>
            <label>
              <FontAwesomeIcon icon={faGraduationCap} />
              {editing ? (
                <input name="education" value={updatedUser.education || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'}  placeholder="education" /> 
              ) : (
                <p className={userInfo.education ? '' : 'placeholder-text'}>
                  {userInfo.education || 'Add your education.'}
                </p>              
                )}
            </label>
            <label>
              <FontAwesomeIcon icon={faUsers} />
              {editing ? (
                <select name="maritalStatus" value={updatedUser.maritalStatus || ''} onChange={handleInputChange}  placeholder="maritalStatus" >
                  <option value="" disabled>Select Civi State</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widower">Widower</option>
                </select>
              ) : (
              <p className={userInfo.maritalStatus ? '' : 'placeholder-text'}>
                {userInfo.maritalStatus || 'Select your marital status.'}
              </p>              
              )}
            </label>
            <label>
              <FontAwesomeIcon icon={faBirthdayCake} />
              {editing ? (
                <input type="date" name="birthDate" value={updatedUser.birthDate || ''} onChange={handleInputChange} className={editing ? '' : 'non-editing-input'} placeholder="Birthdate" />
              ) : (
            <p className={userInfo.birthDate ? '' : 'placeholder-text'}>
              {userInfo.birthDate || 'Select your birth date.'}
            </p>              
            )}
            </label>
            <label>
              <FontAwesomeIcon icon={faHeart} />
              {editing ? (
                <textarea name="interests" value={updatedUser.interests || ''} onChange={handleInputChange} maxLength="500" className={editing ? '' : 'non-editing-input'} placeholder="interests"/>
              ) : (
            <p className={userInfo.interests ? '' : 'placeholder-text'}>
              {userInfo.interests || 'Add your interests.'}
            </p>              
            )}
            </label>
            {editing && (
            <button  type="submit">Update</button>
          )}
        </form>
      </>
    )}
  </div>
);
};

export default DetailsUser;