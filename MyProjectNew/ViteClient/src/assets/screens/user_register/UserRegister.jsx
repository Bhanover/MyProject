import { useState } from "react";
import axios from 'axios';

const UserRegister = ({ className , setFormType }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
    });
    /*La función validateForm se utiliza para validar los campos del 
    formulario*/
    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = "El nombre de usuario es requerido.";
        }

        if (!formData.email) {
            newErrors.email = "El correo electrónico es requerido.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "El correo electrónico es inválido.";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es requerida.";
        } else if (formData.password.length < 8) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* se utiliza como controlador de eventos para actualizar
     el estado del formulario cuando se cambian los valores de los campos de entrada.*/
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    /*se utiliza como controlador de eventos para manejar el envío del formulario*/
    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post("http://localhost:8081/api/auth/signup", formData);
            setFormType("login");
        } catch (error) {
            console.error("Error al registrar:", error);
            if (error.response) {
                setErrors({
                    ...errors,
                    general: "Ocurrió un error al registrar. Por favor, inténtalo de nuevo."
                });
            }
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit} className={className} method="POST">
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                {errors.username && <p>{errors.username}</p>}

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <p>{errors.email}</p>}

                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <p>{errors.password}</p>}

                <br />
                <input type="submit" value="Sign Up" />
            </form>
            {errors.general && <p>{errors.general}</p>}
        </div>
    );
};

export default UserRegister;