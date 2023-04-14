package com.billy.spring.project.socket.service;

import com.billy.spring.project.models.User;
import com.billy.spring.project.socket.dto.ChatMessageDTO;
import com.billy.spring.project.socket.models.Chat;
import com.billy.spring.project.socket.models.ChatMessage;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface ChatService {
    Optional<Chat> getChatById(Long chatId);
    Optional<Chat> getChatByUserIds(Long senderId, Long recipientId);
    Chat createChat(User senderId, User recipientId);
    ChatMessage sendChatMessage(Chat chat, ChatMessageDTO chatMessageDTO);
    User getUserById(Long userId);
    Chat getOrCreateChat(User sender, User recipient);

    void addMessageToChat(Long chatId, ChatMessage chatMessage);

    ChatMessage sendChatMessage(Chat chat, User sender, User recipient, String content);
}