package com.billy.spring.project.socket.controller;


import com.billy.spring.project.models.User;
import com.billy.spring.project.payload.response.MessageResponse;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.socket.models.*;

import com.billy.spring.project.socket.service.ChatService;
import com.billy.spring.project.socket.service.PrivateChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import javax.annotation.security.PermitAll;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/mywebsocket")
public class WebSocketController {
    @Autowired
    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    private final ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrivateChatService privateChatService;

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/chat/general")
    @SendTo("/topic/chat/general")
    public MessagesResponse sendToGeneralChat(MessageRequest message) throws Exception {
        return new MessagesResponse(message.getMessage(), message.getSender());
    }

    @MessageMapping("/chat/{chatId}/sendMessage")
    public void sendMessage(@DestinationVariable Long chatId, @Payload ChatMessage chatMessage) {
        Optional<Chat> chatOptional = chatService.getChatById(chatId);

        if (!chatOptional.isPresent()) {
            throw new RuntimeException("Chat not found");
        }

        Chat chat = chatOptional.get();
        Long senderId = chatMessage.getSenderId().getId();
        Long recipientId = chatMessage.getRecipientId().getId();


        chatService.addMessageToChat(chatId, chatMessage);

        messagingTemplate.convertAndSendToUser(recipientId.toString(), "/queue/messages", chatMessage);
    }

    @MessageMapping("/chat/{userId}/join")
    public void joinChat(@DestinationVariable Long userId, @Payload ChatJoinMessage chatJoinMessage) {
        User recipient = userRepository.findById(userId).orElse(null);

        if (recipient == null) {
            throw new RuntimeException("User not found");
        }

        Long senderId = chatJoinMessage.getSenderId().getId();
        User sender = userRepository.findById(senderId).orElse(null);

        if (sender == null) {
            throw new RuntimeException("User not found");
        }

        Chat chat = chatService.getOrCreateChat(sender, recipient);

        messagingTemplate.convertAndSendToUser(sender.getUsername(), "/queue/chat", chat);
        messagingTemplate.convertAndSendToUser(recipient.getUsername(), "/queue/chat", chat);
    }

}
