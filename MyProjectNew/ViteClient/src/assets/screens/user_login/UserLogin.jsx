import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = ({ className }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        password: "",
        general: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    
    const onSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post("http://localhost:8081/api/auth/signin", formData);
            localStorage.setItem("idP", response.data.id);
            localStorage.setItem("jwtToken", response.data.jwtToken);
            console.log(response.data.jwtToken);
            console.log(response.data.id);
            navigate("/");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            if (error.response) {
                setErrors({
                    ...errors,
                    general: "Error al iniciar sesión. Por favor, verifica tus credenciales e inténtalo de nuevo."
                });
            }
        }
    };
    
    return (
        <div>
            <form className={className} onSubmit={onSubmit}>
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                {errors.username && <p>{errors.username}</p>}
    
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <p>{errors.password}</p>}
    
                <br />
                <input type="submit" id="submit" value="login in" />
            </form>
            {errors.general && <p>{errors.general}</p>}
        </div>
    );
  };

  export default UserLogin;