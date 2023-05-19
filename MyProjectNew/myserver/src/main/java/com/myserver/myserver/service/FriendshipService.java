package com.myserver.myserver.service;

import com.myserver.myserver.models.Friendship;
import com.myserver.myserver.models.FriendshipStatus;
import com.myserver.myserver.models.Notification;
import com.myserver.myserver.models.User;
import com.myserver.myserver.payload.response.FriendInfo;
import com.myserver.myserver.repository.FriendshipRepository;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendshipService {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;

      final  String defaultImageUrl = "https://res.cloudinary.com/dhqfopwka/image/upload/v1683919422/defaultImage/defaultAvatar_f4vs3m.jpg";
    /*Este método devuelve el estado de una relación de amistad entre dos usuarios, identificados por userId y friendId. */
    public Friendship getFriendshipStatus(Long userId, Long friendId) {
        return friendshipRepository.findByUserIdAndFriendIdOrFriendIdAndUserId(userId, friendId, userId, friendId)
                .orElse(new Friendship(userId, friendId, null));
    }
    /*Este método se encarga de enviar una solicitud de amistad desde el usuario con userId al usuario con friendId*/
    public Friendship sendFriendRequest(Long userId, Long friendId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        User friend = userRepository.findById(friendId).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + friendId));
        /*. Crea una nueva instancia de Friendship con estado "PENDING" (pendiente) y la persiste en el repositorio.*/
        Friendship friendship = new Friendship();
        friendship.setUser(user);
        friendship.setFriend(friend);
        friendship.setStatus(FriendshipStatus.PENDING);
        friendship.setCreatedAt(LocalDateTime.now());

        return friendshipRepository.save(friendship);
    }


    /*Este método devuelve una instancia de Friendship identificada por friendshipId.*/
    public Optional<Friendship> findFriendshipById(Long friendshipId) {
        return friendshipRepository.findById(friendshipId);
    }
    /* Este método se encarga de aceptar una solicitud de amistad identificada por friendshipId*/
    public void acceptFriendRequest(Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId).orElseThrow(() -> new IllegalArgumentException("Friendship not found with id: " + friendshipId));

        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new IllegalStateException("Cannot accept friend request with status " + friendship.getStatus());
        }
        /*Cambia el estado de la relación a "ACCEPTED" (aceptado) y la persiste en el repositorio.*/
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);
    }
    /*Este método devuelve la lista de amigos de un usuario identificado por userId*/
    public List<FriendInfo> getFriends(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        List<Friendship> sentFriendships = friendshipRepository.findByUser(user);
        List<Friendship> receivedFriendships = friendshipRepository.findByFriend(user);

        // Aquí, agrega la URL de la imagen por defecto.
        String defaultImageUrl = "https://res.cloudinary.com/dhqfopwka/image/upload/v1683919422/defaultImage/defaultAvatar_f4vs3m.jpg";
        /*Crea una lista de FriendInfo basada en las relaciones de amistad enviadas y recibidas por el usuario.*/
        List<FriendInfo> friends = new ArrayList<>();
        for (Friendship friendship : sentFriendships) {
            String imageUrl = friendship.getFriend().getProfileImage() != null ? friendship.getFriend().getProfileImage().getUrl() : defaultImageUrl;
            friends.add(new FriendInfo(friendship.getFriend().getId(), imageUrl, friendship.getFriend().getUsername(), friendship.getStatus() == FriendshipStatus.PENDING, friendship.getId(), user.getId()));
        }
        for (Friendship friendship : receivedFriendships) {
            String imageUrl = friendship.getUser().getProfileImage() != null ? friendship.getUser().getProfileImage().getUrl() : defaultImageUrl;
            friends.add(new FriendInfo(friendship.getUser().getId(), imageUrl, friendship.getUser().getUsername(), friendship.getStatus() == FriendshipStatus.PENDING, friendship.getId(), friendship.getUser().getId()));
        }

        return friends;
    }
    /*Este método se encarga de eliminar una relación de amistad
    identificada por friendshipId, siempre que su estado sea "ACCEPTED" */
    public void removeFriend(Long friendshipId) {
        Optional<Friendship> optionalFriendship = friendshipRepository.findById(friendshipId);

        if (optionalFriendship.isPresent()) {
            Friendship friendship = optionalFriendship.get();
            if (friendship.getStatus() == FriendshipStatus.ACCEPTED) {
                friendshipRepository.delete(friendship);
                /* Si la relación no existe o su estado no es "ACCEPTED", lanza una excepción de tipo RuntimeException.*/
            } else {
                System.out.println("The friendship status is not accepted.");
                throw new RuntimeException("The friendship status is not accepted.");
            }
        } else {
            System.out.println("Friendship not found.");
            throw new RuntimeException("Friendship not found.");
        }
    }
    /*Este método devuelve una lista de los identificadores de los amigos de un usuario identificado por userId*/
    public List<Long> getFriendIds(Long userId) {
        List<Friendship> friendships = friendshipRepository.findByUser_IdAndStatusOrFriend_IdAndStatus(
                userId, FriendshipStatus.ACCEPTED,
                userId, FriendshipStatus.ACCEPTED
        );
        /* Extrae los ID de los amigos a partir de las relaciones de amistad aceptadas del usuario*/
        List<Long> friendIds = new ArrayList<>();
        for (Friendship friendship : friendships) {
            if (friendship.getUser().getId().equals(userId)) {
                friendIds.add(friendship.getFriend().getId());
            } else {
                friendIds.add(friendship.getUser().getId());
            }
        }
        return friendIds;
    }
}