import { useEffect } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../top_bar/TopBar";

const Container = () =>{
    const [loggedIn,setLoggedIn] = useState("");

    useEffect(() => {
        if(localStorage.getItem("sessionToken") != null ){
            setLoggedIn(true);
        }
    },[]);

    return (
        <div>
            <TopBar loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
            <Outlet  loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
        </div>
    );


}

export default Container;


/*useEffect es un hook de React que se utiliza para ejecutar efectos 
secundarios en componentes. Un efecto secundario es cualquier cambio 
en el estado o la interfaz de usuario que no es directamente causado 
por una actualización de estado o propiedades.

Algunos ejemplos de efectos secundarios incluyen:

Hacer una solicitud de red para obtener datos y actualizar el estado con los resultados.
Configurar o limpiar un temporizador.
Escuchar y manejar eventos del navegador como clics o movimientos del mouse.
Actualizar el título de la página.
El hook useEffect permite ejecutar estos efectos secundarios de manera 
sencilla y controlada, asegurándose de que se limpien cuando sea necesario 
y se eviten los errores de rendimiento.

En resumen, useEffect es una herramienta importante para controlar y
 manejar efectos secundarios en componentes de React, y es una parte 
 fundamental del desarrollo de aplicaciones con React.


*/