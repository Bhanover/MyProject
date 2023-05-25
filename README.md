# MyProject
# Experience
[![React](https://img.shields.io/badge/React-^17.0.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-^14.0.0-green)](https://nodejs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-^2.5.0-brightgreen)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-^3.8.1-yellow)](https://maven.apache.org/)
[![HTML](https://img.shields.io/badge/HTML-5-orange)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-3-blue)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Java](https://img.shields.io/badge/Java-^11.0-orange)](https://www.java.com/)


## Descripción
Experience es una página web completamente funcional que permite a los usuarios registrarse y autenticarse en la plataforma para acceder a diversas características. Proporciona una experiencia personalizada y controlada sobre el contenido, donde los usuarios pueden subir y editar videos, imágenes y publicaciones. Además, incorpora emojis en los campos de entrada para enriquecer la expresividad en las comunicaciones. Los usuarios también pueden buscar y agregar amigos, expandiendo su red y fomentando la interacción social.

## Características Principales
- Registro y autenticación de usuarios.
- Subida y edición de videos, imágenes y publicaciones.
- Personalización del perfil con detalles como nombre de usuario, correo electrónico y foto de perfil.
- Sistema de notificaciones en tiempo real para solicitudes de amistad.
- Vistas de contenido total y publicaciones de amigos en la página principal.
- Lista de usuarios conectados en tiempo real.
- Función de chat para comunicación privada y general entre usuarios.
- Búsqueda y acceso a perfiles de otros usuarios.
- Reacciones a publicaciones mediante "me gusta" o "no me gusta".
- Comentarios en publicaciones, imágenes y videos.

## Bibliotecas y Dependencias

### Servidor (usando Spring Boot):
- Spring Web: Facilita el desarrollo de aplicaciones web RESTful y la interacción con la base de datos.
- Spring Security: Maneja la autenticación y autorización en la aplicación.
- Spring Data JPA: Simplifica la persistencia de datos en la base de datos.
- MySQL Driver: Permite la comunicación con la base de datos MySQL.
- WebSocket: Proporciona comunicación bidireccional en tiempo real.
- spring-boot-starter-validation: Permite la validación de los datos de entrada.
- spring-boot-starter-actuator: Brinda características de gestión y supervisión de la aplicación.
- spring-security-messaging: Asegura el envío de mensajes y soporte de WebSocket en Spring.
- webjars-locator-core: Permite localizar y servir bibliotecas alojadas en WebJars.
- sockjs-client, stomp-websocket: Proporcionan funcionalidad de WebSocket en el cliente.
- cloudinary-http44: Gestiona archivos y su carga a la nube.
- jjwt: Genera y valida JSON Web Tokens (JWT) en la aplicación.

### Cliente (usando React+Vite):
- react-router-dom: Maneja la navegación y el enrutamiento en la aplicación React.
- axios: Realiza solicitudes HTTP desde el cliente React al servidor.
- sockjs-client, stompjs: Proporcionan funcionalidad de WebSocket en el cliente.
- react-dropzone: Permite la carga de archivos mediante arrastrar y soltar.
- @emoji-mart/react, @emoji-mart/data: Proporcionan un selector de emojis en la aplicación.
- react-responsive-carousel: Ofrece un carrusel responsivo en la aplicación.
- @fortawesome/react-fontawesome, @fortawesome/fontawesome-svg-core, @fortawesome/free-solid-svg-icons, font-awesome, @fortawesome/fontawesome-free: Incluye iconos y símbolos en la interfaz de usuario.
- react-intersection-observer: Detecta cuando un elemento está en el punto de vista del viewport para cargar contenido perezosamente o habilitar el scroll infinito.

Estas bibliotecas y dependencias han sido seleccionadas por su robustez, confiabilidad y compatibilidad, brindando una base sólida para el desarrollo y mantenimiento continuo del proyecto.
