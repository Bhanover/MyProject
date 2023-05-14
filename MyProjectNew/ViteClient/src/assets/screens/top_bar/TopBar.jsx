import "./TopBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from 'react-router-dom';

import UserSearch from "../socket/searchUser/UserSearch";
import UserLogout from "../user_logout/UserLogout";

const TopBar = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogoutClick = () => {
    setLogoutOpen(true);
  };

  const handleSearchClick = () => {
    if (window.innerWidth < 800) {
      setShowSearch(!showSearch);
    }
  };

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth >=800) {
        setShowSearch(true);
      } else {
        setShowSearch(false);
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div className="topBar">
      <div className="topBarExp">
        <Link to={`/`}>
          <div className="logoM">
            <span>E</span>
            <span>X</span>
            <span>P</span>
            <p>Ex<span className="primero"></span>erience</p>
          </div>
        </Link>
      </div>
      <div className={`buscador ${showSearch ? 'expanded' : ''}`}>
        {showSearch && (
          <UserSearch />
        )}
        {window.innerWidth < 800 && (
          <button onClick={handleSearchClick}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        )}
      </div>
      <div className={`iconT ${showSearch ? 'hidden' : ''}`}>
        <div className="perfil" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faUser} />
        </div>
        {menuOpen && (
          <div className="dropdown">
            <button onClick={handleLogoutClick}>Cerrar sesión</button>
          </div>
        )}
      </div>
      {logoutOpen && <UserLogout />}
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