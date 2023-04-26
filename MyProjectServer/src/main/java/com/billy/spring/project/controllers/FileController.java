package com.billy.spring.project.controllers;


import com.billy.spring.project.exeption.ResourceNotFoundException;
import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.ImageInfo;
import com.billy.spring.project.models.User;
import com.billy.spring.project.payload.response.ResponseFile;
import com.billy.spring.project.payload.response.ResponseMessage;

import com.billy.spring.project.repository.FileDBRepository;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.jwt.JwtUtils;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.service.FileStorageService;
import com.billy.spring.project.service.ImageService;
import com.billy.spring.project.service.VideoService;
import com.billy.spring.project.utils.FileUploadUtil;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class FileController {

    @Autowired
    private FileStorageService storageService;
    @Autowired
    private FileDBRepository fileDBRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private ImageService imageService;
    @Autowired
    private VideoService videoService;

    @PostMapping("/upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam(value = "description", required = false) String description, HttpServletRequest request) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileType = file.getContentType();

        // Verifica si el archivo es una imagen o un video
        boolean isImage = fileType != null && fileType.startsWith("image/");
        boolean isVideo = fileType != null && fileType.startsWith("video/");

        // Si el archivo no es una imagen ni un video, retorna un error
        if (!isImage && !isVideo) {
            return ResponseEntity.badRequest().body("El archivo no es una imagen ni un video.");
        }

        try {
            // Obtiene el usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Verifica si el token de acceso coincide
            String tokenFromRequest = jwtUtils.getTokenFromRequest(request);

            User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));
            if (tokenFromRequest == null || !tokenFromRequest.equals(user.getJwtToken())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("El token no es válido.");
            }


            // Define las carpetas donde se guardarán las imágenes y videos
            String folder = isImage ? "images/" : "videos/";
            String userFolder = user.getUsername() + "/";

            // Guarda el archivo en Cloudinary en la carpeta correspondiente
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", isImage ? "image" : "video",
                            "folder", folder + userFolder));

            // Crea la entidad FileDB y la guarda en la base de datos
            // Modifica la creación de la entidad FileDB para incluir la relación con User y la descripción
            String url = (String) uploadResult.get("url");
            FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
            fileDB.setUser(user);
            fileDB.setUrl(url);
            fileDB.setDescription(description);
            fileDB.setCreationTime(LocalDateTime.now());

            fileDBRepository.save(fileDB);

            // Retorna la URL del archivo guardado
            return ResponseEntity.ok(url);
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
   @GetMapping("/{id}/user-images")
    public ResponseEntity<List<Map<String, Object>>> getUserImages(@PathVariable Long id) {
        try {
            List<Map<String, Object>> customData = fileDBRepository.findImagesByUserId(id);
            return ResponseEntity.ok(customData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


   /* @GetMapping("/{id}/user-images")
    public ResponseEntity<List<Map<String, String>>> getUserImages(@PathVariable Long id) {
        try {
            // Obtiene el usuario autenticado
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

            // Recupera las imágenes del usuario
            List<FileDB> images = imageService.getImagesByUser(user);
            // Extrae las URLs y los identificadores de las imágenes
            List<Map<String, String>> imageUrlsAndIds = images.stream().map(image -> {
                Map<String, String> imageData = new HashMap<>();
                imageData.put("url", image.getUrl());
                imageData.put("imageId", image.getId());
                imageData.put("description",image.getDescription());
                imageData.put("creationTime", image.getCreationTime().toString());
                return imageData;
            }).collect(Collectors.toList());

            // Retorna la lista de objetos con las URLs y los identificadores de las imágenes
            return ResponseEntity.ok(imageUrlsAndIds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }*/
   /* @GetMapping("/user/{id}/info")
    public ResponseEntity<?> getUserInfo(@PathVariable Long id) {

        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));
*/
    @GetMapping("/{id}/user-videos")
    public ResponseEntity<List<Map<String, String>>> getUserVideos(@PathVariable Long id) {
        try {
            // Obtiene el usuario autenticado
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));


            // Recupera los videos del usuario
            List<FileDB> videos = videoService.getVideosByUser(user);

            // Extrae las URLs y los identificadores de los videos
            List<Map<String, String>> videoUrlsAndIds = videos.stream().map(video -> {
                Map<String, String> videoData = new HashMap<>();
                videoData.put("url", video.getUrl());
                videoData.put("videoId", video.getId());
                videoData.put("description",video.getDescription());
                videoData.put("creationTime", video.getCreationTime().toString());
                return videoData;
            }).collect(Collectors.toList());

            // Retorna la lista de objetos con las URLs y los identificadores de los videos
            return ResponseEntity.ok(videoUrlsAndIds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/set-profile-image")
    public ResponseEntity<String> setProfileImage(@RequestParam("imageId") String imageId) {
        try {
            // Obtiene el usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

            // Encuentra la imagen en la base de datos
            FileDB image = fileDBRepository.findById(imageId).orElseThrow(() -> new RuntimeException("Image Not Found"));

            // Verifica si la imagen pertenece al usuario
            if (!image.getUser().equals(user)) {
                return ResponseEntity.badRequest().body("No tienes permiso para utilizar esta imagen como foto de perfil.");
            }

            // Actualiza la foto de perfil del usuario
            user.setProfileImage(image);
            userRepository.save(user);

            return ResponseEntity.ok("Foto de perfil actualizada.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @DeleteMapping("/user-files/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable("fileId") String fileId) {
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

            // Elimina el archivo
            fileDBRepository.delete(file);

            return ResponseEntity.ok("Archivo eliminado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @DeleteMapping("/user-images/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable("imageId") String imageId) {
        try {
            // Obtiene el usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

            // Encuentra la imagen en la base de datos
            FileDB image = fileDBRepository.findById(imageId).orElseThrow(() -> new RuntimeException("Image Not Found"));

            // Verifica si la imagen pertenece al usuario
            if (!image.getUser().equals(user)) {
                return ResponseEntity.badRequest().body("No tienes permiso para eliminar esta imagen.");
            }

            // Elimina la imagen
            fileDBRepository.delete(image);

            return ResponseEntity.ok("Imagen eliminada.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

 /*@PostMapping("/upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam(value = "description", required = false) String description) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileType = file.getContentType();

        // Verifica si el archivo es una imagen o un video
        boolean isImage = fileType != null && fileType.startsWith("image/");
        boolean isVideo = fileType != null && fileType.startsWith("video/");

        // Si el archivo no es una imagen ni un video, retorna un error
        if (!isImage && !isVideo) {
            return ResponseEntity.badRequest().body("El archivo no es una imagen ni un video.");
        }

        try {
            // Obtiene el usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            System.out.println("Authentication: " + authentication); // Agrega esta línea para imprimir la información de autenticación

            User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

            // Define las carpetas donde se guardarán las imágenes y videos
            String folder = isImage ? "images/" : "videos/";
            String userFolder = user.getUsername() + "/";

            // Guarda el archivo en Cloudinary en la carpeta correspondiente
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", isImage ? "image" : "video",
                            "folder", folder + userFolder));

            // Crea la entidad FileDB y la guarda en la base de datos
            // Modifica la creación de la entidad FileDB para incluir la relación con User y la descripción
            String url = (String) uploadResult.get("url");
            FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
            fileDB.setUser(user);
            fileDB.setUrl(url);
            fileDB.setDescription(description);
            fileDB.setCreationTime(LocalDateTime.now());

            fileDBRepository.save(fileDB);

            // Retorna la URL del archivo guardado
            return ResponseEntity.ok(url);
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }*/
    /*@GetMapping("/all-images")
    public ResponseEntity<List<Map<String, String>>> getAllImages() {
        try {
            List<FileDB> images = fileDBRepository.findAllByContentTypeStartingWith("image/");
            List<Map<String, String>> imageUrlsAndIds = images.stream().map(image -> {
                Map<String, String> imageData = new HashMap<>();
                imageData.put("url", image.getUrl());
                imageData.put("imageId", image.getId());
                imageData.put("description", image.getDescription());
                imageData.put("creationTime", image.getCreationTime().toString());
                imageData.put("userId", image.getUser().getId());
                return imageData;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(imageUrlsAndIds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }*/
  /* esto es el valido para subir imagenes en este servidor @PostMapping("/upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileType = file.getContentType();

        // Verifica si el archivo es una imagen o un video
        boolean isImage = fileType != null && fileType.startsWith("image/");
        boolean isVideo = fileType != null && fileType.startsWith("video/");

        // Si el archivo no es una imagen ni un video, retorna un error
        if (!isImage && !isVideo) {
            return ResponseEntity.badRequest().body("El archivo no es una imagen ni un video.");
        }

        String uploadDir = "uploads";
        String subfolder = isImage ? "images" : "videos";

        try {
            // Crea las carpetas uploads, images y videos si no existen
            FileUploadUtil.createDirIfNotExists(uploadDir);
            FileUploadUtil.createDirIfNotExists(uploadDir + "/" + subfolder);

            // Obtiene el usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

            // Guarda el archivo en la carpeta correspondiente (images o videos)
            String filePath = uploadDir + "/" + subfolder + "/" + fileName;
            Path path = Paths.get(filePath);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Crea la entidad FileDB y la guarda en la base de datos
            // Modifica la creación de la entidad FileDB para incluir la relación con User
            FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
            fileDB.setUser(user);
            fileDBRepository.save(fileDB);

            // Retorna la URL del archivo guardado
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(subfolder + "/")
                    .path(fileName)
                    .toUriString();
            return ResponseEntity.ok(fileUrl);
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
*/
/*
   @PostMapping("/upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileType = file.getContentType();

        // Verifica si el archivo es una imagen o un video
        boolean isImage = fileType != null && fileType.startsWith("image/");
        boolean isVideo = fileType != null && fileType.startsWith("video/");

        // Si el archivo no es una imagen ni un video, retorna un error
        if (!isImage && !isVideo) {
            return ResponseEntity.badRequest().body("El archivo no es una imagen ni un video.");
        }

        String uploadDir = isImage ? "uploads/images" : "uploads/videos";

        // Crea las carpetas uploads/images y uploads/videos si no existen
        FileUploadUtil.createDirIfNotExists(uploadDir);

        // El resto del código sigue igual...
       // Guarda el archivo en la carpeta uploads
       String filePath = uploadDir + "/" + fileName;
       Path path = Paths.get(filePath);
       Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

       // Crea la entidad FileDB y la guarda en la base de datos
       // Modifica la creación de la entidad FileDB para incluir la relación con User
       FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
       fileDB.setUser(user);
       fileDBRepository.save(fileDB);

        // Retorna la URL del archivo guardado
        String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/" + uploadDir + "/")
                .path(fileName)
                .toUriString();
        return ResponseEntity.ok(fileUrl);
    }*/
/*
    @PostMapping("/upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String uploadDir = "uploads";

        try {
            // Crea la carpeta uploads si no existe
            FileUploadUtil.createDirIfNotExists(uploadDir);

            // Obtiene el usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

            // Guarda el archivo en la carpeta uploads
            String filePath = uploadDir + "/" + fileName;
            Path path = Paths.get(filePath);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Crea la entidad FileDB y la guarda en la base de datos
            // Modifica la creación de la entidad FileDB para incluir la relación con User
            FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
            fileDB.setUser(user);
            fileDBRepository.save(fileDB);

            // Retorna la URL del archivo guardado
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();
            return ResponseEntity.ok(fileUrl);
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
*/
    /*
    @PostMapping("/upload")
    public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file) {
        System.out.println("dentro");
        String message = "";
        try {
            storageService.store(file);

            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (IOException e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + "! Cause: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Unexpected error while uploading the file: " + file.getOriginalFilename() + "! Cause: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseMessage(message));
        }
    }*/
/*
    @GetMapping("/files")
    public ResponseEntity<List<ResponseFile>> getListFiles() {
        List<ResponseFile> files = storageService.getAllFiles().map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/files/")
                    .path(dbFile.getId())
                    .toUriString();

            return new ResponseFile(
                    dbFile.getName(),
                    fileDownloadUri,
                    dbFile.getType(),
                    dbFile.getData().length);
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        FileDB fileDB = storageService.getFile(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDB.getName() + "\"")
                .body(fileDB.getData());
    }*/
}