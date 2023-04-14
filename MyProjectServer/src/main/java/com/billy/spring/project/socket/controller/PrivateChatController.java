package com.billy.spring.project.socket.controller;

import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.socket.models.Chat;
import com.billy.spring.project.socket.models.ChatMessage;
import com.billy.spring.project.socket.models.PrivateChat;
import com.billy.spring.project.socket.models.PrivateChatMessage;
import com.billy.spring.project.socket.service.ChatService;
import com.billy.spring.project.socket.service.PrivateChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@Controller

@MessageMapping("/private-chat")
public class PrivateChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrivateChatService privateChatService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat.private.{chatId}")
    public void handlePrivateMessage(@Payload ChatMessage chatMessage, @DestinationVariable Long chatId) {
        Optional<PrivateChat> chatOptional = Optional.ofNullable(privateChatService.getPrivateChatById(chatId));
        if (chatOptional.isPresent()) {
            PrivateChat chat = chatOptional.get();
            Long senderId = chatMessage.getSenderId().getId();
            Long recipientId = chat.getSenderId().equals(senderId) ? chat.getRecipientId() : chat.getSenderId();
            simpMessagingTemplate.convertAndSend("/queue/messages.private." + recipientId, chatMessage);
        } else {
            Long senderId = chatMessage.getSenderId().getId();
            Long recipientId = chatMessage.getRecipientId().getId();

            User sender = userRepository.findById(senderId).orElse(null);
            User recipient = userRepository.findById(recipientId).orElse(null);
            if (sender == null || recipient == null) {
                return;
            }

            Chat newChat = chatService.createChat(sender, recipient);
            simpMessagingTemplate.convertAndSend("/queue/messages.private." + recipientId, chatMessage);
        }
    }

}