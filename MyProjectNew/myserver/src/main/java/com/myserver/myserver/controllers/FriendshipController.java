package com.myserver.myserver.controllers;

import com.myserver.myserver.models.Friendship;
import com.myserver.myserver.models.FriendshipStatus;
import com.myserver.myserver.models.Notification;
import com.myserver.myserver.models.User;
import com.myserver.myserver.payload.response.FriendInfo;
import com.myserver.myserver.repository.FriendshipRepository;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.service.UserDetailsImpl;
import com.myserver.myserver.service.FriendshipService;
import com.myserver.myserver.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


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
    /*Este metódo se encarga de enviar una solicitud de amistad al usuario identificado por friendId*/
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
        notification.setCreatedAt(LocalDateTime.now());  // Agregando fecha de creación a la notificación
        notificationService.save(notification);

        return new ResponseEntity<>(newFriendship, HttpStatus.CREATED);
    }
    /*Este método maneja las solicitudes PUT a la ruta /accept/{friendshipId}.
     Acepta una solicitud de amistad identificada por friendshipId*/
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
    /*Este método maneja las solicitudes GET a la ruta /friendship-status/{friendId}.
    Obtiene el estado de amistad con el usuario identificado por friendId*/
    @GetMapping("/friendship-status/{friendId}")
    public ResponseEntity<Friendship> getFriendshipStatus(@PathVariable Long friendId) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));
        /*utiliza friendshipService para obtener el estado de la amistad. */
        Friendship friendship = friendshipService.getFriendshipStatus(user.getId(), friendId);
        return new ResponseEntity<>(friendship, HttpStatus.OK);
    }
    /*Este método maneja las solicitudes PUT a la ruta /reject/{friendshipId}.
    Rechaza una solicitud de amistad identificada por friendshipId*/
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

    /*Este método maneja las solicitudes GET a la ruta /{id}/friends.
     Obtiene la lista de amigos del usuario identificado por id. */
    @GetMapping("/{id}/friends")
    public ResponseEntity<List<FriendInfo>> getUserFriends(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

        List<FriendInfo> friends = friendshipService.getFriends(user.getId());
        return new ResponseEntity<>(friends, HttpStatus.OK);
    }
    /* Este método maneja las solicitudes DELETE a la ruta /remove/{friendshipId}.
     Elimina una amistad identificada por friendshipId*/
    @DeleteMapping("/remove/{friendshipId}")
    public ResponseEntity<?> removeFriend(@PathVariable Long friendshipId) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));


        try {
            friendshipService.removeFriend(friendshipId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
