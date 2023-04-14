package com.billy.spring.project.socket.controller;

import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.socket.dto.ChatMessageDTO;
import com.billy.spring.project.socket.models.Chat;
import com.billy.spring.project.socket.models.ChatMessage;
import com.billy.spring.project.socket.service.ChatService;
import com.billy.spring.project.socket.service.PrivateChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/mywebsocket")
public class MessageController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrivateChatService privateChatService;

    @PostMapping("/chat/{recipientId}")
    public ResponseEntity<Chat> createChat(@PathVariable Long recipientId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long senderId = userDetails.getId();

        Optional<Chat> chatOptional = chatService.getChatByUserIds(senderId, recipientId);
        Chat chat;
        if (chatOptional.isPresent()) {
            chat = chatOptional.get();
        } else {
            User sender = userRepository.findById(senderId).orElse(null);
            User recipient = userRepository.findById(recipientId).orElse(null);
            if (sender == null || recipient == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            chat = chatService.createChat(sender, recipient);
        }

        return new ResponseEntity<>(chat, HttpStatus.CREATED);
    }

    @PostMapping("/chat/{chatId}/message")
    public ResponseEntity<ChatMessage> sendChatMessage(@PathVariable Long chatId, @RequestBody ChatMessageDTO chatMessageDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long senderId = userDetails.getId();
        chatMessageDTO.setSenderId(senderId);

        Optional<Chat> chatOptional = chatService.getChatById(chatId);
        if (chatOptional.isPresent()) {
            Chat chat = chatOptional.get();
            Long recipientId = chat.getSenderId().equals(senderId) ? chat.getRecipientId() : chat.getSenderId();
            // Verificar que el usuario autenticado sea parte del chat
            if (!chat.getSenderId().equals(senderId) && !chat.getRecipientId().equals(senderId)) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            User sender = userRepository.findById(senderId).orElse(null);
            User recipient = userRepository.findById(recipientId).orElse(null);
            if (sender == null || recipient == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            ChatMessage chatMessage = chatService.sendChatMessage(chat, sender, recipient, chatMessageDTO.getContent());
            return new ResponseEntity<>(chatMessage, HttpStatus.CREATED);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
