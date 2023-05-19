package com.myserver.myserver.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.myserver.myserver.exception.UnauthorizedException;
import com.myserver.myserver.models.FileDB;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.FileDBRepository;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class FileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileDBRepository fileDBRepository;

    @Autowired
    private Cloudinary cloudinary;
    /*Este método toma un archivo MultipartFile, una descripción del archivo y las credenciales de un usuario
     (UserDetailsImpl userDetails), y carga este archivo a un servicio de almacenamiento en la nube como Cloudinary,*/
    public String uploadFile(MultipartFile file, String description, UserDetailsImpl userDetails) throws IOException, IllegalArgumentException, UnauthorizedException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileType = file.getContentType();
         boolean isImage = fileType != null && fileType.startsWith("image/");
        boolean isVideo = fileType != null && fileType.startsWith("video/");
        /*El método primero verifica que el archivo sea una imagen o un video basándose en su tipo de contenido (contentType)*/

        if (!isImage && !isVideo) {
            /*Si no lo es, lanza una excepción.*/
            throw new IllegalArgumentException("El archivo no es una imagen ni un video.");
        }
        /* Luego, busca en la base de datos al usuario que está subiendo el archivo, y si no se encuentra, lanza una excepción.*/
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        String folder = isImage ? "images/" : "videos/";
        String userFolder = user.getUsername() + "/";
        /*Después, sube el archivo a un servicio de almacenamiento en la nube (Cloudinary)
        y guarda el resultado de la subida, que incluye la URL del archivo subido*/
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", isImage ? "image" : "video",
                        "folder", folder + userFolder));

        String url = (String) uploadResult.get("url");
        FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
        fileDB.setUser(user);
        fileDB.setUrl(url);
        fileDB.setDescription(description);
        fileDB.setCreationTime(LocalDateTime.now());
        /* guarda los detalles de la subida del archivo en la base de datos*/
        fileDBRepository.save(fileDB);
        /*El método devuelve la URL del archivo subido.*/
        return url;
    }
    /*Este método se encarga de eliminar archivos. Acepta un único parámetro: la ID del archivo que se va a eliminar.*/
    public ResponseEntity<String> deleteFile(String fileId) {
        try {
            // Obtiene el usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

            // Encuentra el archivo en la base de datos
            FileDB file = fileDBRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File Not Found"));

            // Verifica si el archivo es una imagen o un video
            String fileType = file.getContentType();
            boolean isImage = fileType != null && fileType.startsWith("image/");
            boolean isVideo = fileType != null && fileType.startsWith("video/");

            // Si el archivo no es una imagen ni un video, retorna un error
            if (!isImage && !isVideo) {
                return ResponseEntity.badRequest().body("El archivo no es una imagen ni un video.");
            }

            // Verifica si el archivo pertenece al usuario
            if (!file.getUser().equals(user)) {
                return ResponseEntity.badRequest().body("No tienes permiso para eliminar este archivo.");
            }

            // Verifica si el archivo es una imagen de perfil
            if (user.getProfileImage() != null && user.getProfileImage().getId().equals(file.getId())) {
                // Establece la imagen de perfil en null y guarda el usuario
                user.setProfileImage(null);
                userRepository.save(user);
            }

            // Elimina el archivo
            fileDBRepository.delete(file);

            return ResponseEntity.ok("Archivo eliminado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
