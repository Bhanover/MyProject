package com.billy.spring.project.socket.service;


import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.socket.dto.ChatMessageDTO;
import com.billy.spring.project.socket.models.Chat;
import com.billy.spring.project.socket.models.ChatMessage;
import com.billy.spring.project.socket.repository.ChatMessageRepository;
import com.billy.spring.project.socket.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Override
    public Optional<Chat> getChatById(Long chatId) {
        return chatRepository.findById(chatId);
    }

    @Override
    public Optional<Chat> getChatByUserIds(Long senderId, Long recipientId) {
        return chatRepository.findBySenderIdAndRecipientId(senderId, recipientId);
    }

    @Override
    public Chat createChat(User senderId, User recipientId) {
        Chat chat = new Chat(senderId.getId(), recipientId.getId());
        return chatRepository.save(chat);
    }

    @Override
    public ChatMessage sendChatMessage(Chat chat, ChatMessageDTO chatMessageDTO) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatId(chat);

        // Get the sender and recipient User objects from the UserRepository
        User sender = userRepository.findById(chatMessageDTO.getSenderId()).orElse(null);
        User recipient = userRepository.findById(chatMessageDTO.getRecipientId()).orElse(null);

        if (sender == null || recipient == null) {
            throw new RuntimeException("Sender or recipient not found");
        }

        chatMessage.setSenderId(sender);
        chatMessage.setRecipientId(recipient);
        chatMessage.setContent(chatMessageDTO.getContent());

        return chatMessageRepository.save(chatMessage);
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public Chat getOrCreateChat(User sender, User recipient) {
        Optional<Chat> existingChat = chatRepository.findBySenderIdAndRecipientId(sender.getId(), recipient.getId());

        if (existingChat.isPresent()) {
            return existingChat.get();
        } else {
            Chat newChat = new Chat(sender.getId(), recipient.getId());
            return chatRepository.save(newChat);
        }
    }
    @Override
    public void addMessageToChat(Long chatId, ChatMessage chatMessage) {
        Optional<Chat> chatOptional = chatRepository.findById(chatId);
        if (!chatOptional.isPresent()) {
            throw new RuntimeException("Chat not found");
        }
        Chat chat = chatOptional.get();
        chat.addMessage(chatMessage);
        chatMessageRepository.save(chatMessage);
    }

    @Override
    public ChatMessage sendChatMessage(Chat chat, User sender, User recipient, String content) {
        ChatMessage chatMessage = new ChatMessage(chat, sender, recipient, content);
        chat.addMessage(chatMessage);
        chatRepository.save(chat);
        return chatMessageRepository.save(chatMessage);
    }


}