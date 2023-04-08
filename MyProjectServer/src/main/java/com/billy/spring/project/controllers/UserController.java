package com.billy.spring.project.controllers;

import com.billy.spring.project.models.User;
import com.billy.spring.project.payload.response.MessageResponse;
import com.billy.spring.project.payload.response.UserInfoResponse;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
@CrossOrigin(origins = "*", maxAge = 3600)

@RestController
@RequestMapping("/api/auth")
public class UserController {

    // Otras dependencias y métodos del controlador
    @Autowired
    UserRepository userRepository;
    @GetMapping("/user/info")
    public ResponseEntity<?> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());

        if (user.getProfileImage() != null) {
            response.put("profileImage", user.getProfileImage().getUrl());
        } else {
            response.put("profileImage", null);
        }

        return ResponseEntity.ok(response);
    }

}