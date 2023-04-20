package com.billy.spring.project.socket.controller;


import java.security.Principal;
import java.util.List;

import com.billy.spring.project.exeption.InvalidJwtException;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.jwt.JwtUtils;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.security.services.UserDetailsServiceImpl;
import com.billy.spring.project.service.UserService;
import com.billy.spring.project.socket.models.MessageRequest;
import com.billy.spring.project.socket.models.MessagesResponse;
import com.billy.spring.project.socket.models.PrivateMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;


import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

    @MessageMapping("/chat/general")
    @SendTo("/topic/chat/general")
    public MessagesResponse sendToGeneralChat(MessageRequest message) throws Exception {
        return new MessagesResponse(message.getMessage(), message.getSender());
    }

    /* @MessageMapping("/chat/private")
     public void sendToPrivateChat(MessageRequest message, Principal principal) throws Exception {
         // Comprobar si el destinatario existe
         Optional<User> recipientUser = userRepository.findByUsername(message.getRecipient());
         System.out.println(("esto es el mensaje "+message));
         System.out.println("Mensaje enviado a la cola: " + new MessagesResponse(message.getMessage(), message.getSender()));
         System.out.println("Enviando mensaje privado a: " + recipientUser);
         System.out.println("Mensaje: " + message);
         if (recipientUser.isPresent()) {
             System.out.println("Enviando mensaje a esta persona->: " + recipientUser.get().getUsername()); // Añadir registro de depuración

             simpMessagingTemplate.convertAndSendToUser(
                     recipientUser.get().getUsername(),
                     "/queue/chat/private",
                     new MessagesResponse(message.getMessage(), message.getSender())
             );
             System.out.println(simpMessagingTemplate);
         } else {
             throw new Exception("Recipient not found");
         }
     }*/
    @MessageMapping("/chat/private")
    public void sendPrivateMessage(PrivateMessage privateMessage, Principal principal) {
        String roomName = privateMessage.getRoomName();
        simpMessagingTemplate.convertAndSend("/queue/chat/private/" + privateMessage.getRoomName(), privateMessage);
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

    /*@MessageMapping("/search")
    @SendTo("/user/queue/search")
    public List<User> searchUsers(@RequestParam(name = "searchTerm") String searchTerm) {
        System.out.println("Buscando usuarios con término de búsqueda: " + searchTerm);
        List<User> results = userRepository.searchUsers(searchTerm);
        System.out.println("Se encontraron " + results.size() + " usuarios.");
        System.out.println("result " + results);

        return results;
    }*/


}


