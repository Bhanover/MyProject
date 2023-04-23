package com.billy.spring.project.controllers;

import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.Publication;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.FileDBRepository;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.jwt.JwtUtils;
import com.billy.spring.project.service.FileStorageService;
import com.billy.spring.project.service.ImageService;
import com.billy.spring.project.service.PublicationService;
import com.billy.spring.project.service.VideoService;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class ListPublicationAllController {
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
    private PublicationService publicationService;

    @Autowired
    private ImageService imageService;
    @Autowired
    private VideoService videoService;

    /*  List<FileDB> images = fileDBRepository.findByUserAndContentTypeStartingWith(user, "image/");
        List<FileDB> videos = fileDBRepository.findByUserAndContentTypeStartingWith(user, "video/");
        List<Publication> publications = publicationService.getPublicationsByUser(user);*/
    @GetMapping("/{id}/content")
    public List<Object> getUserContent(@PathVariable Long id,
                                       @RequestParam(defaultValue = "0") int start,
                                       @RequestParam(defaultValue = "3") int count) {
        // Recupera las imágenes, videos y publicaciones del usuario
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

        List<FileDB> images = fileDBRepository.findByUserAndContentTypeStartingWith(user, "image/");
        List<FileDB> videos = fileDBRepository.findByUserAndContentTypeStartingWith(user, "video/");
        List<Publication> publications = publicationService.getPublicationsByUser(user);

        // Combina imágenes, videos y publicaciones en una sola lista y ordena por fecha de creación
        List<Object> combinedContent = Stream.of(images, videos, publications)
                .flatMap(Collection::stream)
                .sorted(Comparator.comparing(obj -> {
                    if (obj instanceof FileDB) {
                        return ((FileDB) obj).getCreationTime();
                    } else {
                        return ((Publication) obj).getCreationTime();
                    }
                }).reversed())
                .collect(Collectors.toList());

        // Aplica paginación en el servidor
        int endIndex = Math.min(start + count, combinedContent.size());
        List<Object> paginatedContent = combinedContent.subList(start, endIndex);

        // Retorna la lista paginada
        return paginatedContent;
    }



}
