package com.myserver.myserver.controllers;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.myserver.myserver.exception.UnauthorizedException;
import com.myserver.myserver.repository.FileDBRepository;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.jwt.JwtUtils;
import com.myserver.myserver.security.service.UserDetailsImpl;
import com.myserver.myserver.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class FileController {
    @Autowired
    private FileService fileService;
    @Autowired
    private FileDBRepository fileDBRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private JwtUtils jwtUtils;
    final  String defaultImageUrl = "https://res.cloudinary.com/dhqfopwka/image/upload/v1683919422/defaultImage/defaultAvatar_f4vs3m.jpg";

    /* Este método se utiliza para manejar las subidas de archivos fotos o videos */
    @PostMapping("/upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam(value = "description", required = false) String description, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            /*utiliza el servicio fileService para cargar el archivo, guardar
             la información en la base de datos y generar una URL para acceder al archivo.*/
            String url = fileService.uploadFile(file, description, userDetails);
            return ResponseEntity.ok(url);
            /*Esta excepción salta si se proporciona un argumento inválido.*/
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
            /*Esta excepción salta si el usuario no está autorizado para realizar la operación de carga de archivos.*/
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
            /*Esta excepción es de tipo genérico*/
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /*,Se obtiene todas las imagenes  ,toma un parámetro de ruta id que representa el identificador del
       usuario y los detalles del usuario autenticado.*/
    @GetMapping("/{id}/user-images")
    public ResponseEntity<List<Map<String, Object>>> getUserImages(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        /*Se comprueba que el usuario esta authenticado para poder acceder al recurso*/
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            List<Map<String, Object>> customData = fileDBRepository.findImagesByUserId(id, defaultImageUrl);
            return ResponseEntity.ok(customData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    /*,Se obtiene todas los videos  ,toma un parámetro de ruta id que representa el identificador del
    usuario y los detalles del usuario autenticado.*/
    @GetMapping("/{id}/user-videos")
    public ResponseEntity<List<Map<String, Object>>> getUserVideos(@PathVariable Long id,@AuthenticationPrincipal UserDetails userDetails) {
        /*Se comprueba que el usuario esta authenticado para poder acceder al recurso*/

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            List<Map<String, Object>> customData = fileDBRepository.findVideosByUserId(id, defaultImageUrl);
            return ResponseEntity.ok(customData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /*Toma un parámetro de ruta fileId que representa el ID del archivo que se desea elimina*/
    @DeleteMapping("/user-files/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable("fileId") String fileId) {
        return fileService.deleteFile(fileId);
    }


}
