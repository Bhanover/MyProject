import React from 'react';
import "./NotFound.css"
import { Link, useLocation } from 'react-router-dom';

const NotFound = () => {
    return (
      <div className="notFoundN">
        <div className="centroLN">
          <h1>404</h1>
          <p>Página no encontrada</p>
        </div>
        <div className="footerLN">
          <p>Lo sentimos, la página que estás buscando no existe.</p>
          <Link to={`/`} >Volver a la Página principal</Link>
        </div>
      </div>
    );
  };
  
  export default NotFound;
