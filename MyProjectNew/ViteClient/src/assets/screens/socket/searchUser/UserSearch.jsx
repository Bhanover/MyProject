import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import "./UserSearch.css"
function UserSearch(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const navigate = useNavigate();
  const [stompClient, setStompClient] = useState(null);
  const debounceTimeout = useRef(null);
  const [displayCount, setDisplayCount] = useState(6);
  const searchContainer = useRef(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/mywebsocket");
    const stompClient = Stomp.over(socket);
    console.log("antes de subscribe");
    stompClient.connect( 
      { Authorization: localStorage.getItem("jwtToken") }, // Añade el token JWT aquí
      () => {
        stompClient.subscribe("/topic/searchResults", (message) => {
           
          const data = JSON.parse(message.body);
          console.log("dentro de subscribe");
          setSearchResults(data);
          setSearchError(data.length === 0);
        });
        setStompClient(stompClient);
      }
    );
    console.log("después de subscribe")
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);
  
  const handleShowMoreClick = () => {
    setDisplayCount(displayCount + 6);
  };
  const displayedResults = searchResults.slice(0, displayCount);
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    setShowResults(true);
    if (stompClient) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        stompClient.send(
          "/app/searchUsers",
          { Authorization: localStorage.getItem("jwtToken") },
          event.target.value
        );
      }, 500); // Tiempo de espera en milisegundos
    }
  };

  const handleResultClick = (user_id) => {
    const result = searchResults.find((result) => result.id === user_id);
    if (result) {
      navigate(`/profilePage/${user_id}`);
    }
  };

  const handleSearchClick = () => {
    if (stompClient) {
      stompClient.send(
        "/app/searchUsers",
        { Authorization: localStorage.getItem("jwtToken") }, // Añade el token JWT aquí
        JSON.stringify({ search_term: searchTerm })
      );
    }
     setShowResults(true); // Añade esta línea
  setSearchResults([]); // Limpia los resultados de búsqueda

  };
  const handleClickOutside = (event) => {
    if (searchContainer.current && !searchContainer.current.contains(event.target)) {
      setSearchTerm(""); // Limpia el término de búsqueda
      setShowResults(false); // Oculta los resultados
    }
  };
      /* <button onClick={handleSearchClick}>          <FontAwesomeIcon icon={faSearch} />
      </button>*/
  return (
    <div className="userSearchUS" ref={searchContainer}>
      <div className="userSearch-textUS"> 
      <input
        type="text"
        placeholder="Buscar por nombre o apodo"
        value={searchTerm}
        onChange={handleInputChange}
      />
  
      </div>
      <div className={`userSearch-infoUS${showResults ? " show" : ""}`}>

      {searchError ? (
        <p>Usuario no encontrado</p>
      ) : (
        displayedResults.map((results) => (
          <div key={results.id} onClick={() => handleResultClick(results.id)}>
            <p>{results.username}</p>
          </div>
        ))
      )}
      
      {searchResults.length > displayCount && (
        <button onClick={handleShowMoreClick}>Mostrar más</button>
      )}
      </div>
    </div>
  );
}

export default UserSearch;
