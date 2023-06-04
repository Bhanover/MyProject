import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import "./UserSearch.css"
/*Este componente permite a los usuarios buscar otros usuarios por su nombre*/
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
  const [loading, setLoading] = useState(true);
  /* Si el usuario no está autenticado, se redirige a la página de inicio de sesión*/
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
  
    if (!jwtToken) {
      navigate("/loginPage");
    } else {
      /*Si el usuario está autenticado, se establece una conexión WebSocket para recibir los resultados de la búsqueda. */
      const socket = new SockJS("http://localhost:8081/mywebsocket");
      const stompClient = Stomp.over(socket);
  
  
      stompClient.connect(
        { Authorization: jwtToken },
        () => {
          stompClient.subscribe("/topic/searchResults", (message) => {
            const data = JSON.parse(message.body);
            setSearchResults(data);
            setSearchError(data.length === 0);
            setLoading(false);
          });
          setStompClient(stompClient);
        }
      );
       /*También se añade un evento de escucha para el clic fuera del componente,
       que limpiará el término de búsqueda y ocultará los resultados.*/
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        if (stompClient && stompClient.connected) {
          stompClient.disconnect();
        }
      };
    }
  }, []);
  /*Este método maneja el clic en el botón "Mostrar más", que incrementa la cantidad de resultados mostrados en un número específico.*/
  const handleShowMoreClick = () => {
    setDisplayCount(displayCount + 6);
  };
  const displayedResults = searchResults.slice(0, displayCount);
  /* Este método maneja el cambio de entrada del término de búsqueda*/
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    setShowResults(true);
    if (stompClient) {
      /*Implementa un debounce para retrasar la solicitud de búsqueda hasta que el usuario deje de escribir durante un tiempo específico.*/
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        setLoading(true); 

        stompClient.send(
          "/app/searchUsers",
          { Authorization: localStorage.getItem("jwtToken") },
          event.target.value
        );
      }, 500); // Tiempo de espera en milisegundos
    }
  };
/*Este método maneja el clic en un resultado de búsqueda, navegando al perfil del usuario seleccionado.*/
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
        { Authorization: localStorage.getItem("jwtToken") },
        JSON.stringify({ search_term: searchTerm })
      );
    }
     setShowResults(true);
  setSearchResults([]); 

  };
  const handleClickOutside = (event) => {
    if (searchContainer.current && !searchContainer.current.contains(event.target)) {
      setSearchTerm(""); // Limpia el término de búsqueda
      setShowResults(false); // Oculta los resultados
    }
  };
      /* <button onClick={handleSearchClick}>          <FontAwesomeIcon icon={faSearch} />
      </button>*/


/*Este renderiza un campo de entrada para la búsqueda y los resultados de la búsqueda.*/
  return (
    <div className="userSearchUS" ref={searchContainer}>
      <div className="userSearch-textUS"> 
      <input
        type="text"
        placeholder="Search by username"
        value={searchTerm}
        onChange={handleInputChange}
      />
  
      </div>
      <div className={`userSearch-infoUS${showResults ? " show" : ""}`}>
      {loading ? (
              <div className="spinnerSearch"></div>
            ) : searchError ? (
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
