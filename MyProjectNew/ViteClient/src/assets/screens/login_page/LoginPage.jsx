import React, { useState } from "react";
import LoginForm from "../user_login/UserLogin";
import RegisterForm from "../user_register/UserRegister";
import "./LoginPage.css";

const LoginPage = () => {
  const [formType, setFormType] = useState("login");

  return (
    <div className="grid-containerL" >
      <div className="headerL">
        <div className="logoP">
          <span>E</span>
          <span>X</span>
          <span>P</span>
          <p>
            Ex<span className="primero"></span>erience
          </p>
        </div>
      </div>
      <div className="centroL">
        <div className="form-container">
          <button onClick={() => setFormType("login")}
           className={formType === "login" ? "button-active" : ""}

          >Login</button>
          <button onClick={() => setFormType("register")}
          className={formType === "register" ? "button-active" : ""}

          >Register</button>

                {formType === "login" ? (
        <LoginForm className={formType === "login" ? "form-slide-animation" : ""} />
      ) : (
        <RegisterForm
        className={formType === "register" ? "form-slide-animation" : ""}
        setFormType={setFormType}
      />
      )}
        </div>
      </div>
      <div className="footerL">
      
          <a href="https://es.wikipedia.org/wiki/Privacidad">Política de privacidad</a>
          <a href="https://es.wikipedia.org/wiki/Privacidad">Centro de privacidad</a>
          <a href="https://es.wikipedia.org/wiki/Privacidad">Condiciones</a>
          <a href="https://es.wikipedia.org/wiki/Privacidad">Ayuda</a>
          <a href="https://es.wikipedia.org/wiki/Privacidad">MetaVerso Experecience</a>
       
      </div>
    </div>
  );
};

export default LoginPage;

/*
Este código es un ejemplo de cómo tener dos formularios de inicio de 
sesión y registro en la misma página, pero que solo se muestre uno a 
la vez. La aplicación está construida con React, y utiliza el estado 
local para controlar qué formulario se muestra.

La variable "formType" se define con el useState hook. Este hook nos 
permite utilizar el estado local en nuestro componente. La inicialización 
del estado es "login", lo que significa que el primer formulario que se 
mostrará es el de inicio de sesión.

En el código HTML, hay dos botones: uno para inicio de sesión y 
otro para registro. Cada botón tiene una función de callback asociada 
que se activa cuando se hace clic en el botón. La función setFormType 
se utiliza para actualizar el estado de formType.

Finalmente, se utiliza un operador ternario para renderizar el 
formulario correcto basado en el estado de formType. Si formType es "login", 
se renderiza el componente LoginForm. Si formType es "register", se renderiza 
el componente RegisterForm.
*/