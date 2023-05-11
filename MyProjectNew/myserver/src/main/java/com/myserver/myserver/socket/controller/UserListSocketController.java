package com.myserver.myserver.socket.controller;


import com.myserver.myserver.models.Friendship;
import com.myserver.myserver.models.FriendshipStatus;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.FriendshipRepository;
import com.myserver.myserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;


@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/mywebsocket")
public class UserListSocketController {

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
        messagingTemplate.convertAndSend("/topic/online", "{\"userId\": \"" + userId + "\"}");
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
            userRepository.flush();
        });
    }


}