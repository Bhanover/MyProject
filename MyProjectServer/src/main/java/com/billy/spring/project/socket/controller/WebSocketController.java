package com.billy.spring.project.socket.controller;


import java.security.Principal;
import java.util.Optional;

import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.socket.models.MessageRequest;
import com.billy.spring.project.socket.models.MessagesResponse;
import com.billy.spring.project.socket.models.PrivateMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;


import org.springframework.messaging.handler.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/mywebsocket")
public class WebSocketController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

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
        simpMessagingTemplate.convertAndSend("/queue/chat/private/" + roomName, privateMessage);
    }
}


