# MyProject
# Experience


 
[![React](https://img.shields.io/badge/React-^17.0.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-^14.0.0-green)](https://nodejs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-^2.5.0-brightgreen)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-^3.8.1-yellow)](https://maven.apache.org/)
[![HTML](https://img.shields.io/badge/HTML-5-orange)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-3-blue)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Java](https://img.shields.io/badge/Java-^11.0-orange)](https://www.java.com/)

<p align="center">
  <img src="https://github.com/Bhanover/MyProject/assets/127310131/7b694bcb-6b80-4db0-9c73-c1f85aa1e731" alt="iconPage2">
</p>

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

## Requisitos del Sistema
Para ejecutar este proyecto, necesitarás lo siguiente instalado en tu sistema:
- Java 11 o superior
- Node.js v14 o superior
- MySQL 5.7 o superior
- Git
- Un IDE adecuado como IntelliJ IDEA para Spring Boot y Visual Studio Code para React.


### Instalación y Configuración del entorno de desarrollo

#### IntelliJ IDEA
1. Descarga e instala [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) Community Edition.
2. Clona el repositorio en tu máquina local.
3. Abre IntelliJ IDEA y selecciona "Open" en el diálogo inicial. Busca y selecciona la carpeta del proyecto que acabas de clonar.
4. IntelliJ IDEA detectará automáticamente el archivo `pom.xml` y configurará tu proyecto en base a él. Si se te solicita, permite que IntelliJ IDEA descargue e instale los plugins y dependencias necesarios.

#### Visual Studio Code
1. Descarga e instala [Visual Studio Code](https://code.visualstudio.com/download).
2. Abre Visual Studio Code y selecciona "Open Folder" desde el menú "File". Busca y selecciona la carpeta del cliente dentro del proyecto que clonaste.
3. Ejecuta `npm install` en la terminal de Visual Studio Code para instalar las dependencias necesarias del cliente.

### Configuración de la base de datos

Es necesario tener MySQL instalado y configurado en tu máquina local. Una vez hecho esto, debes configurar las credenciales y otros parámetros de la base de datos siguienod el archivo `application.properties` del servidor de Spring Boot donde se encuentra el nombre que debes usar en la base de datos y el usuario que debes usar en Mysql junto con su contraseña.

```properties
spring.datasource.url= jdbc:mysql://localhost:3306/experience?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username= root
spring.datasource.password= 1234
server.port=8081
```
Una ves creado en Mysql el usuario "root" con password "1234" no olvides de crear la base de datos con el comando `create database experience`;

## Cómo Empezar
Después de configurar el entorno de desarrollo y la base de datos, puedes iniciar el servidor y el cliente de la siguiente manera:

### Servidor (Spring Boot)
1. En IntelliJ IDEA, busca la clase principal de la aplicación (usualmente nombrada `Application` o `Main`) en el panel de archivos del proyecto.
2. Haz clic derecho en la clase principal y selecciona 'Run `Application.main()`' en el menú contextual. Esto iniciará el servidor en el puerto que se especificó en el archivo `application.properties`.


![nombre-de-la-imagen](https://drive.google.com/uc?export=view&id=1ge621BZQAZnkZO5_thW8VXrYKbhu342x)
### Cliente (React)
1. Abre Visual Studio Code y navega a la terminal integrada.
2. Asegúrate de que estás en la carpeta del cliente y ejecuta `npm start` en la terminal. Esto iniciará el cliente, y generalmente se abrirá automáticamente en una nueva pestaña de tu navegador.

Una vez que el servidor y el cliente estén funcionando, puedes interactuar con la aplicación a través de tu navegador.

## Uso
1. Registro y autenticación: Para usar la aplicación, primero debes registrarte y autenticarte.
2. Subida de contenidos: Para subir un video, imagen o publicación, haz click en...

![screenshot](ruta/a/la/captura/de/pantalla)
## Cómo Contribuir
Las contribuciones son bienvenidas y apreciadas. Sigue estos pasos para contribuir:
1. Haz un "Fork" del repositorio.
2. Clona el fork a tu máquina local.
3. Crea una nueva rama para tu cambio.
4. Haz tus cambios y asegúrate de probarlos.
5. Haz un "commit" de tus cambios a tu rama.
6. Haz un "push" de tus cambios a tu fork en GitHub.
7. Abre un "Pull Request" en el repositorio original.

Por favor, asegúrate de que tu código sigue las convenciones de estilo del proyecto y que has añadido pruebas para cualquier cambio que hagas, si es aplicable.


## Contacto
Si tienes preguntas o deseas discutir algo sobre el proyecto, no dudes en contactarme a través de mi correo electrónico: billydht5@gmail.com

## Licencia
[MIT](https://choosealicense.com/licenses/mit/)


