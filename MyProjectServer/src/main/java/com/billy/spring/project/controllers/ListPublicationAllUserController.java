package com.billy.spring.project.controllers;

import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.FileDBRepository;
import com.billy.spring.project.repository.PublicationRepository;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.jwt.JwtUtils;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.service.*;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class ListPublicationAllUserController {


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
    private PublicationRepository publicationRepository;
    @Autowired
    private ImageService imageService;
    @Autowired
    private VideoService videoService;
    @Autowired
    private  ListPublicationAllController listPublicationAllController;
    /*@GetMapping("/all-user-content")
    public List<Map<String, Object>> getAllUserContent() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        List<User> users = userRepository.findAll();
        List<Map<String, Object>> allContent = new ArrayList<>();

        for (User user : users) {
            List<Map<String, Object>> userContent = listPublicationAllController.getUserContent(user.getId());
            allContent.addAll(userContent);
        }
        // Ordena todo el contenido combinado por fecha de creación
        List<Map<String, Object>> combinedContent = allContent.stream()
                .sorted((map1, map2) -> {
                    LocalDateTime dateTime1 = (LocalDateTime) map1.get("creationTime");
                    LocalDateTime dateTime2 = (LocalDateTime) map2.get("creationTime");
                    return dateTime2.compareTo(dateTime1); // Ordena de manera descendente (más reciente a más antiguo)
                })
                .collect(Collectors.toList());

        // Retorna la lista completa
        return combinedContent;
    }*/



    @Autowired
    private ContentService contentService;

    @GetMapping("/friends-content")
    public ResponseEntity<List<Map<String, Object>>> getFriendsContent() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        List<Map<String, Object>> friendsContent = contentService.getFriendsContent(currentUser);
        return new ResponseEntity<>(friendsContent, HttpStatus.OK);
    }



}
