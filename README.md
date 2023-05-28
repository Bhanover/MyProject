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
  <img src="https://github.com/Bhanover/MyProject/assets/127310131/9a209c1d-556e-437b-bb39-788ba2322459" alt="iconPage2">
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

Es necesario tener MySQL instalado y configurado en tu máquina local. Una vez hecho esto, debes configurar las credenciales y otros parámetros de la base de datos siguiendo el archivo `application.properties` del servidor de Spring Boot donde se encuentra el nombre que debes usar en la base de datos y el usuario que debes usar en Mysql junto con su contraseña.

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

![image](https://github.com/Bhanover/MyProject/assets/127310131/e7fdda1f-6c65-4516-b273-62e29dc0fde5)


### Cliente (React)
1. Abre Visual Studio Code y navega a la terminal integrada.
2. Asegúrate de que estás en la carpeta del cliente `/MyProject/MyProjectNew/ViteClient` y ejecuta `npm install` en la terminal para actualizar las dependecias alojadas en el proyecto.
3. A continuación añade `npm run dev` esto iniciará el cliente, y generalmente se abrirá automáticamente en una nueva pestaña de tu navegador.

![image](https://github.com/Bhanover/MyProject/assets/127310131/22f5bdf3-13ac-40cf-84a7-e1cff0974d9f)

Una vez que el servidor y el cliente estén funcionando, puedes interactuar con la aplicación a través de tu navegador.

## Guía de Uso Detallada

1. **Registro y autenticación:** Antes de que puedas acceder a todas las increíbles funcionalidades de la plataforma, debes registrarte. Para ello, haz clic en el botón de registro en la página (loginPage). Se te pedirá que proporciones algunos datos personales básicos y que elijas un nombre de usuario y una contraseña. Recuerda que tu contraseña debe ser segura y única. Una vez que hayas completado el registro, debes autenticarte introduciendo tu nombre de usuario y contraseña en el formulario de inicio de sesión.

2. **Explorando la página principal:** Al iniciar sesión, serás redirigido a la página principal. Aquí, en la parte superior de la página, verás una lista en tiempo real de tus amigos que están actualmente conectados a la plataforma.

3. **Búsqueda de usuarios:** Si estás buscando a un amigo o simplemente quieres explorar y conocer gente nueva, utiliza la función de búsqueda ubicada en la parte superior de la página. Simplemente introduce el nombre de usuario que estás buscando y se buscara a los usuarios que coincidan con esos datos en tiempo real.

4. **Chats públicos y privados:** La plataforma incluye una funcionalidad de chat para la comunicación entre usuarios. En la parte izquierda de la pantalla, encontrarás una lista de chat público al que puedes unirte. Si prefieres tener una conversación privada, utiliza el buscador de chat para encontrar al usuario con el que quieres chatear.

5. **Publicaciones:** La sección central de la página es tu tablero de publicaciones. Aquí puedes compartir tus pensamientos, experiencias, noticias o cualquier otra cosa que desees comunicar a tu red de amigos. Para hacer una publicación, simplemente escribe tu mensaje en el cuadro de texto y haz clic en el botón de publicación.

6. **Interacción con publicaciones:** La plataforma te permite ver y responder a las publicaciones de tus amigos. Puedes mostrar tu apoyo o reconocimiento a una publicación haciendo clic en el botón de "me gusta". También tienes la opción de comentar en las publicaciones si deseas iniciar una conversación o simplemente expresar tu opinión.

7. **Ampliando tu red de amigos:** Si encuentras a alguien con quien te gustaría interactuar más o si simplemente quieres ampliar tu red de amigos, puedes enviar solicitudes de amistad a otros usuarios. Para hacerlo, visita su perfil y haz clic en el botón "Send Request".

8. **Solicitudes de amistad:** Cuando envíes una solicitud de amistad, la otra persona la recibirá en su perfil y se le notificará. Si la otra persona acepta tu solicitud, se añadirá a tu red de amigos y podrás ver e interactuar con todas sus futuras publicaciones.

9. **Explorando perfiles de usuarios:** Visitar el perfil de un usuario es una gran manera de conocer más sobre él. En el perfil de un usuario, puedes ver todo el contenido que ha compartido, incluyendo videos, imágenes y publicaciones. También puedes ver su lista de amigos.

10. **Comentarios:** Puedes comentar cualquier publicación de un amigo o la tuya y asi poder expresar tus opiniones tambien pudes dar likes o dislikes a las publicaciones.

## Información Importante

- **Subida de imágenes y videos:** Es importante notar que solo se pueden subir imágenes y videos con un tamaño máximo de 10MB debido a las restricciones de Cloudinary, que es el servicio que utilizamos para almacenar este tipo de archivos. Esto se debe a que estamos utilizando la versión gratuita de Cloudinary, que tiene un límite de tamaño de archivo.
- **Conexión con la base de datos:** Es importante saber que tienes que tener bien conectado la base de datos con spring boot en el caso de que no lo este te saldra este error:

![image](https://github.com/Bhanover/MyProject/assets/127310131/1c082f26-aadb-4338-9905-e57984bf196e)

Una posible solución es que si hiciste todos los pasos bien , ademas de eso tienes que tener el programa de Mysql abierto.


- **Activar Lombook:** En Spring Boot al iniciar el proyecto por primera vez , Spring Boot te pedira que actives la Lombook y en ese caso das click a `enabled lombook`


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
Este proyecto está licenciado bajo [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).



