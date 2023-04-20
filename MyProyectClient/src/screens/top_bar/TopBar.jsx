
import "./TopBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
const TopBar =(props)=>{
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

    return (
        <div className="topBar">
            <div> 
            <button className="openbtn" onclick="openNav()">☰</button>  
            <div className="logoM">
                <span>E</span>
                <span>X</span>
                <span>P</span>
                <p>Ex<span className="primero"></span>erience</p>
            </div>
            </div> 
            <div className="buscador">
                <input type="search"></input>
                <div> 
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </div>
            <div className="iconT">
                <div className="perfil"></div>
                 
            </div>
        </div>
    );
}


export default TopBar;