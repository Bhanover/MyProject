package com.myserver.myserver.controllers;


import com.cloudinary.Cloudinary;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.FileDBRepository;
import com.myserver.myserver.repository.PublicationRepository;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.jwt.JwtUtils;
import com.myserver.myserver.security.service.UserDetailsImpl;
import com.myserver.myserver.service.ContentService;
import com.myserver.myserver.service.PublicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class ListPublicationAllUserController {



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
    private  ListPublicationAllController listPublicationAllController;


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
