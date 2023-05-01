package com.billy.spring.project.socket.controller;

import com.billy.spring.project.models.Friendship;
import com.billy.spring.project.models.FriendshipStatus;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.FriendshipRepository;
import com.billy.spring.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/mywebsocket")
public class UserListSocketController {
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @MessageMapping("/online")
    public void online(Message<String> message, Principal principal) {
        String userId = message.getPayload(); // Cambia esta línea para obtener el userId del mensaje
        System.out.println("Usuario en línea: " + userId);
        updateUserOnlineStatus(userId, true);

        // Agregar un temporizador para enviar el mensaje de estado en línea después de 2 segundos
        scheduler.schedule(() -> {
            messagingTemplate.convertAndSend("/topic/online", "{\"userId\": \"" + userId + "\"}");
        }, 2, TimeUnit.SECONDS);
    }

    @MessageMapping("/offline")
    public void offline(Message<String> message, Principal principal) {
        String userId = message.getPayload(); // Cambia esta línea para obtener el userId del mensaje
        System.out.println("Usuario fuera de línea: " + userId);
        updateUserOnlineStatus(userId, false);
        messagingTemplate.convertAndSend("/topic/offline", "{\"userId\": \"" + userId + "\"}");
    }

    @GetMapping("/onlineFriends")
    public ResponseEntity<List<User>> getOnlineFriends(Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + principal.getName()));

        List<Friendship> sentFriendships = friendshipRepository.findByUserAndStatus(currentUser, FriendshipStatus.ACCEPTED);
        List<User> onlineSentFriends = new ArrayList<>();
        for (Friendship friendship : sentFriendships) {
            if (friendship.getFriend().isOnline()) {
                onlineSentFriends.add(friendship.getFriend());
            }
        }

        List<Friendship> receivedFriendships = friendshipRepository.findByFriendAndStatus(currentUser, FriendshipStatus.ACCEPTED);
        List<User> onlineReceivedFriends = new ArrayList<>();
        for (Friendship friendship : receivedFriendships) {
            if (friendship.getUser().isOnline()) {
                onlineReceivedFriends.add(friendship.getUser());
            }
        }

        List<User> onlineFriends = new ArrayList<>(onlineSentFriends);
        onlineFriends.addAll(onlineReceivedFriends);
        return ResponseEntity.ok(onlineFriends);
    }



    public void updateUserOnlineStatus(String userId, boolean isOnline) {
        userRepository.findById(Long.parseLong(userId)).ifPresent(user -> {
            user.setOnline(isOnline);
            userRepository.save(user);
            userRepository.flush(); // Agrega esta línea
        });
    }


}