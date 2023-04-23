import { useState, useEffect } from 'react';
import axios from 'axios';

const UseUserInfo = (props) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');

    axios
      .get(`http://localhost:8081/api/auth/user/${props.userId}/info`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return userInfo;
};

export default UseUserInfo;