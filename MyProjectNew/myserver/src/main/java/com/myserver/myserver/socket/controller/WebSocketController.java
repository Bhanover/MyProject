package com.myserver.myserver.socket.controller;



import com.myserver.myserver.exception.InvalidJwtException;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.jwt.JwtUtils;
import com.myserver.myserver.security.service.UserDetailsServiceImpl;
import com.myserver.myserver.service.UserService;
import com.myserver.myserver.socket.models.MessageRequest;
import com.myserver.myserver.socket.models.MessagesResponse;
import com.myserver.myserver.socket.models.PrivateMessage;
import com.myserver.myserver.socket.repository.PrivateMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/mywebsocket")
public class WebSocketController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private UserService userService;
    @Autowired
    private PrivateMessageRepository privateMessageRepository;

    @MessageMapping("/chat/general")
    @SendTo("/topic/chat/general")
    public MessagesResponse sendToGeneralChat(MessageRequest message) throws Exception {
        return new MessagesResponse(message.getMessage(), message.getSender());
    }


    @MessageMapping("/chat/private")
    public void sendPrivateMessage(PrivateMessage privateMessage, Principal principal) {
        String roomName = privateMessage.getRoomName();
        privateMessage.setTimestamp(LocalDateTime.now()); // Añadir la marca de tiempo actual al mensaje
        privateMessageRepository.save(privateMessage); // Guardar el mensaje en la base de datos
        simpMessagingTemplate.convertAndSend("/queue/chat/private/" + privateMessage.getRoomName(), privateMessage);
    }
    @GetMapping("/chat/private/history/{recipient}")
    public ResponseEntity<?> getPrivateChatHistory(@PathVariable String recipient, Principal principal) {
        String currentUsername = principal.getName();
        List<PrivateMessage> messages = privateMessageRepository.findChatHistory(currentUsername, recipient);
        return ResponseEntity.ok(messages);
    }
    @MessageMapping("/searchUsers")
    public void searchUsers(@Header("Authorization") String token, String searchTerm) throws InvalidJwtException {
        if (token != null && jwtUtils.validateToken(token)) {
            String username = jwtUtils.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            // Realiza la búsqueda de usuarios aquí
            List<User> users = userService.searchUsers(searchTerm);
            System.out.println("Usuarios encontrados: " + users.size());

            // Envía los resultados al cliente aquí
            simpMessagingTemplate.convertAndSend("/topic/searchResults", users);
            System.out.println("Resultados enviados al cliente");
        }
    }


}


