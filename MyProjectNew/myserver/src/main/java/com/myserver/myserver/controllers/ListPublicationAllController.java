package com.myserver.myserver.controllers;


import com.cloudinary.Cloudinary;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.FileDBRepository;
import com.myserver.myserver.repository.PublicationRepository;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.jwt.JwtUtils;
import com.myserver.myserver.security.service.UserDetailsImpl;
import com.myserver.myserver.service.PublicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class ListPublicationAllController {

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
    private PublicationRepository publicationRepository;
    final String defaultImageUrl = "https://res.cloudinary.com/dhqfopwka/image/upload/v1683919422/defaultImage/defaultAvatar_f4vs3m.jpg";


    @GetMapping("/{id}/content")
    @PreAuthorize("isAuthenticated()")
    public List<Map<String, Object>> getUserContent(@PathVariable Long id) {
        // Recupera las imágenes, videos y publicaciones del usuario
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));
        List<Map<String, Object>> imagesAndVideos = fileDBRepository.findImagesAndVideosByUser(user, defaultImageUrl);
        List<Map<String, Object>> publications = publicationRepository.findPublicationsByUser(user, defaultImageUrl);

        // Combina imágenes, videos y publicaciones en una sola lista y ordena por fecha de creación
        List<Map<String, Object>> combinedContent = Stream.concat(imagesAndVideos.stream(), publications.stream())
                .sorted((map1, map2) -> {
                    LocalDateTime dateTime1 = (LocalDateTime) map1.get("creationTime");
                    LocalDateTime dateTime2 = (LocalDateTime) map2.get("creationTime");
                    return dateTime2.compareTo(dateTime1); // Ordena de manera descendente (más reciente a más antiguo)
                })
                .collect(Collectors.toList());

        // Retorna la lista completa
        return combinedContent;
    }
}

