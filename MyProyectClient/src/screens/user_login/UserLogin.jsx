import { useState } from "react";
import axios from 'axios';


import { useNavigate } from "react-router-dom";
 
const UserLogin = ({ className }) => {
  

    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        username:'',
        password:'',
    });

    const onSubmit = (e) =>{
        e.preventDefault()
        axios.post('http://localhost:8081/api/auth/signin', formData).then((response) => {
            localStorage.setItem('idP', response.data.id);
            localStorage.setItem('jwtToken', response.data.accessToken);
            console.log(response.data.accessToken)
            console.log(response.data.id)
       

      navigate('/');
        })
    };
    const onChangeUsername =(e) =>{
        setFormData({
            username:e.target.value,
            password:formData.password,
        })
    }
    const onChangePassword =(e) =>{
        setFormData({
            username:formData.username,
            password:e.target.value,
        })
    }

    return(<div>

            <form className={className} onSubmit={onSubmit}>
                <label>Username</label>
                <input type="text"  onChange={onChangeUsername}></input>
                <label>Password</label>
                <input type="password"  onChange={onChangePassword}></input><br></br>
                <input type="submit" id="submit" value="login in"></input>
            </form>
             
    </div>

    )

}

export default UserLogin;
/*
import { useState, useEffect } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useNavigate } from "react-router-dom";

const UserLogin = ({ className }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/mywebsocket");
    const client = Stomp.over(socket);
    setStompClient(client);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/api/auth/signin", formData)
      .then((response) => {
        localStorage.setItem("idP", response.data.id);
        localStorage.setItem("jwtToken", response.data.accessToken);
        console.log(response.data.accessToken);
        console.log(response.data.id);

        if (stompClient) {
          stompClient.connect(
            { Authorization: response.data.accessToken },
            (frame) => {
              stompClient.send(
                "/app/online",
                { Authorization: response.data.accessToken },
                response.data.id
              );
            }
          );
        }

        navigate("/");
      });
  };

  const onChangeUsername = (e) => {
    setFormData({
      username: e.target.value,
      password: formData.password,
    });
  };

  const onChangePassword = (e) => {
    setFormData({
      username: formData.username,
      password: e.target.value,
    });
  };

  return (
    <div>
      <form className={className} onSubmit={onSubmit}>
        <label>Username</label>
        <input type="text" onChange={onChangeUsername}></input>
        <label>Password</label>
        <input type="password" onChange={onChangePassword}></input>
        <br></br>
        <input type="submit" id="submit" value="login in"></input>
      </form>
    </div>
  );
};

export default UserLogin;*/