package com.billy.spring.project.controllers;
import com.billy.spring.project.repository.FileDBRepository;
import com.billy.spring.project.models.Friendship;
import com.billy.spring.project.models.FriendshipStatus;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.FriendshipRepository;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.service.FileStorageService;
import com.billy.spring.project.service.FriendshipService;
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
import java.util.Optional;
import java.util.stream.Collectors;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @Autowired
    private  UserRepository userRepository;

    @PostMapping("/request/{friendId}")
    public ResponseEntity<Friendship> sendFriendRequest(@PathVariable Long friendId) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        // Agrega un registro de evento aquí
        System.out.println("Sending friend request from user " + user.getId() + " to friend " + friendId);

        System.out.println("Before calling sendFriendRequest service");
        Friendship newFriendship = friendshipService.sendFriendRequest(user.getId(), friendId);
        System.out.println("After calling sendFriendRequest service");
        // Agrega otro registro de evento aquí
        System.out.println("Friend request sent successfully. Friendship id: " + newFriendship.getId());
        return new ResponseEntity<>(newFriendship, HttpStatus.CREATED);
    }

    @PutMapping("/accept/{friendshipId}")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable Long friendshipId) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        // Intenta obtener la información de la solicitud de amistad
        Optional<Friendship> optionalFriendship = friendshipService.findFriendshipById(friendshipId);

        if (!optionalFriendship.isPresent()) {
            return new ResponseEntity<>("Friendship not found", HttpStatus.NOT_FOUND);
        }

        Friendship friendship = optionalFriendship.get();

        // Verifica si el usuario autenticado es el destinatario de la solicitud de amistad antes de aceptarla
        if (!friendship.getFriend().getId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        friendshipService.acceptFriendRequest(friendshipId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/reject/{friendshipId}")
    public ResponseEntity<?> rejectFriendRequest(@PathVariable Long friendshipId) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        // Agrega la lógica adicional que necesites aquí, como verificar si el usuario autenticado es el destinatario de la solicitud de amistad antes de rechazarla

        friendshipService.rejectFriendRequest(friendshipId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/friends")
    public ResponseEntity<List<User>> getFriends() {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        List<User> friends = friendshipService.getFriends(user.getId());
        return new ResponseEntity<>(friends, HttpStatus.OK);
    }
    @DeleteMapping("/remove/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable Long friendId) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        // Agrega la lógica adicional que necesites aquí, como verificar si el usuario autenticado es amigo del amigo antes de eliminarlo

        friendshipService.removeFriend(user.getId(), friendId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
