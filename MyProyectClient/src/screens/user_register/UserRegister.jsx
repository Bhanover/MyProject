import { useState } from "react";
import axios from 'axios';
const UserRegister = ({ className , setFormType }) => {

    /*const [username,setUsername]= useState("");
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");*/
    const [formData,setFormData]=useState({
        username: "",
        email: "",
        password: "",
    })
    const onChangeUsername = (e) => {
        setFormData({
          ...formData,
          username: e.target.value,
        });
    };
    const onChangeEmail = (e) => {
        setFormData({
          ...formData,
          email: e.target.value,
        });
    };
    const onChangePassword = (e) => {
        setFormData({
          ...formData,
          password: e.target.value,
        });
    };

    const onSubmit = (e) => {
      console.log(formData);
      e.preventDefault();
  
      axios
        .post("http://localhost:8081/api/auth/signup", formData)
        .then((response) => {
          console.log(response);
          setFormType("login"); // Cambia a la vista de inicio de sesión
        });
    };




    return(<div>
       <form onSubmit={onSubmit} className={className} method="POST">
            <label>Username:</label>
            <input type="text" onChange={onChangeUsername}></input>
            <label>Email:</label>
            <input type="email" onChange={onChangeEmail} ></input>
            <label>Password:</label>
            <input type="password" onChange={onChangePassword} ></input>
            <br />
            <input type="submit" value="Sign Up"></input>
        </form> 
        


    </div>

    )

}

export default UserRegister;