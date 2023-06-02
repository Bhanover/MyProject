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

