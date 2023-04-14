package com.billy.spring.project.controllers;
import com.billy.spring.project.dto.PublicationDTO;
import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.Publication;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.service.PublicationService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class PublicationController {

    @Autowired
    private PublicationService publicationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/publications")
    public ResponseEntity<List<Publication>> getPublications() {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        List<Publication> publications = publicationService.getPublicationsByUser(user);
        return new ResponseEntity<>(publications, HttpStatus.OK);
    }

    @PostMapping("/publication")
    public ResponseEntity<Publication> createPublication(@RequestBody PublicationDTO publicationDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Publication newPublication = publicationService.createPublication(publicationDTO, user);
        return new ResponseEntity<>(newPublication, HttpStatus.CREATED);
    }

}
