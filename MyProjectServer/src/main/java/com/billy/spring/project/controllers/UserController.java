package com.billy.spring.project.controllers;

import com.billy.spring.project.models.User;
import com.billy.spring.project.payload.response.MessageResponse;
import com.billy.spring.project.payload.response.UserInfoResponse;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
@CrossOrigin(origins = "*", maxAge = 3600)

@RestController
@RequestMapping("/api/auth")
public class UserController {

    // Otras dependencias y métodos del controlador
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/user")
    public ResponseEntity<?> getUserInfo() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long id = userDetails.getId();
        String username = userDetails.getUsername();
        String email = userDetails.getEmail();

        // Consultar la entidad User completa desde la base de datos
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String profileImageUrl = user.getProfileImage() != null ? user.getProfileImage().getUrl() : null;

            UserInfoResponse userInfoResponse = new UserInfoResponse(id, username, email, profileImageUrl);
            return ResponseEntity.ok(userInfoResponse);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Error: User not found"));
        }
    }
}