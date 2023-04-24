package com.billy.spring.project.controllers;

import com.billy.spring.project.models.Friendship;
import com.billy.spring.project.models.User;
import com.billy.spring.project.models.UserSearchResponse;
import com.billy.spring.project.payload.response.MessageResponse;
import com.billy.spring.project.payload.response.UserInfoResponse;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.service.FriendshipService;
import com.billy.spring.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class UserController {

    // Otras dependencias y métodos del controlador
    @Autowired
    private UserService userService;
    @Autowired
    FriendshipService friendshipService;
    @Autowired
    UserRepository userRepository;

    @GetMapping("/user/{id}/info")
    public ResponseEntity<?> getUserInfo(@PathVariable Long id) {
        try {
            Map<String, Object> userInfo = userRepository.findUserInfoById(id)
                    .orElseThrow(() -> new RuntimeException("User Not Found"));

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


/*
        @GetMapping("/user/{id}/info")
        public ResponseEntity<?> getUserInfo(@PathVariable Long id) {

            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

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
        }*/

        /* @GetMapping("/user/info")
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
*/
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchFriends(@RequestParam String query) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        // Realiza la búsqueda en el repositorio de usuarios
        List<User> matchingUsers = userRepository.searchUsersByUsernameOrEmail(query);

        // Filtra los usuarios que ya son amigos del usuario autenticado
        List<User> filteredUsers = matchingUsers.stream()
                .filter(u -> !friendshipService.areFriends(user.getId(), u.getId()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(filteredUsers, HttpStatus.OK);
    }
    @GetMapping("/users")
    public ResponseEntity<List<UserSearchResponse>> searchUsers(@RequestParam String query) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        // Busca los usuarios que coincidan con la consulta
        List<User> users = userRepository.searchUsersByUsernameOrEmail(query);

        // Convierte los usuarios en respuestas de búsqueda
        List<UserSearchResponse> responses = users.stream()
                .map(u -> {
                    boolean areFriends = friendshipService.areFriends(user.getId(), u.getId());
                    return new UserSearchResponse(u, areFriends);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }
    @GetMapping("/getusers")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
}