import "./TopBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from "react";

const TopBar =(props)=>{
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="topBar">
      <div> 
        <div className="logoM">
          <span>E</span>
          <span>X</span>
          <span>P</span>
          <p>Ex<span className="primero"></span>erience</p>
        </div>
      </div> 
      <div className={`buscador ${showSearch ? 'mobile' : ''}`}>
        <input type="search"></input>
        <div> 
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </div>
      <div className="buscador-icon" onClick={toggleSearch}>
        <FontAwesomeIcon icon={faSearch} />
      </div>
      <div className="iconT">
        <div className="perfil" onClick={toggleMenu}></div>
        {menuOpen && (
          <div className="dropdown">
            <button onClick={() => {}}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;


/*
    const doLogout = () => {
        sendLogoutRequest();
        localStorage.removeItem("idpersona");
        localStorage.removeItem("sessionToken");

        props.setLoggedIn(false);
    };

    const sendLogoutRequest = () => {

        const idpersona=localStorege.getItem(idpersona);
        const sessionToken = localStorage.getItem(sessionToken);

        if (idpersona != null && sessionToken != null) {

            axios.delete(BASE_URL+"login/${idpersona}",{
                headers:{"sessionToken":sessionToken}
            });
        }
    };

*/