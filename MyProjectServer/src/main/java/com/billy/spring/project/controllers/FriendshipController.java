package com.billy.spring.project.controllers;
import com.billy.spring.project.models.*;
import com.billy.spring.project.repository.FileDBRepository;
import com.billy.spring.project.repository.FriendshipRepository;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.service.FileStorageService;
import com.billy.spring.project.service.FriendshipService;
import com.billy.spring.project.service.NotificationService;
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
    private FriendshipRepository friendshipRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;
    @PostMapping("/request/{friendId}")
    public ResponseEntity<Friendship> sendFriendRequest(@PathVariable Long friendId) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        Friendship newFriendship = friendshipService.sendFriendRequest(user.getId(), friendId);

        // Crear una notificación
        User friend = userRepository.findById(friendId).orElseThrow(() -> new RuntimeException("Friend Not Found"));
        Notification notification = new Notification();
        notification.setUser(friend);
        notification.setType("FriendRequest");
        notification.setContent(user.getUsername() + " te ha enviado una solicitud de amistad.");
        notification.setRead(false);
        notificationService.save(notification);

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
    @GetMapping("/friendship-status/{friendId}")
    public ResponseEntity<Friendship> getFriendshipStatus(@PathVariable Long friendId) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        Friendship friendship = friendshipService.getFriendshipStatus(user.getId(), friendId);
        return new ResponseEntity<>(friendship, HttpStatus.OK);
    }
    @PutMapping("/reject/{friendshipId}")
    public ResponseEntity<?> rejectFriendRequest(@PathVariable Long friendshipId) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        // Intenta obtener la información de la solicitud de amistad
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        if (!friendship.getStatus().equals(FriendshipStatus.PENDING)) {
            throw new RuntimeException("The friendship status is not pending.");
        }

        // Elimina la solicitud de amistad en lugar de cambiar su estado a rechazado
        if (!friendship.getFriend().getId().equals(user.getId()) && !friendship.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to reject this friend request.");
        }

// Elimina la solicitud de amistad en lugar de cambiar su estado a rechazado
        friendshipRepository.deleteById(friendshipId);

// Devuelve una respuesta exitosa con un mensaje de confirmación
        return ResponseEntity.ok("Friend request rejected successfully.");
    }


    @GetMapping("/{id}/friends")
    public ResponseEntity<List<FriendInfo>> getUserFriends(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

        List<FriendInfo> friends = friendshipService.getFriends(user.getId());
        return new ResponseEntity<>(friends, HttpStatus.OK);
    }
    @DeleteMapping("/remove/{friendshipId}")
    public ResponseEntity<?> removeFriend(@PathVariable Long friendshipId) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));
        System.out.println("User ID: " + user.getId()  + ", Friendship ID: " + friendshipId); // Agrega esta línea

        try {
            friendshipService.removeFriend(friendshipId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            System.out.println("Error: " + e.getMessage()); // Agrega esta línea
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
  /*  @GetMapping("/friends")
     public ResponseEntity<List<User>> getFriends() {
         // Obtiene el usuario autenticado
         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
         UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
         User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

         List<User> friends = friendshipService.getFriends(user.getId());
         return new ResponseEntity<>(friends, HttpStatus.OK);
     }*/
    /*@GetMapping("/friends")
    public ResponseEntity<List<FriendInfo>> getFriends() {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        List<FriendInfo> friends = friendshipService.getFriends(user.getId());
        return new ResponseEntity<>(friends, HttpStatus.OK);
    }*/