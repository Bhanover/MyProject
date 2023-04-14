package com.billy.spring.project.socket.service;

import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.socket.models.PrivateChat;
import com.billy.spring.project.socket.models.PrivateChatMessage;
import com.billy.spring.project.socket.repository.PrivateChatMessageRepository;
import com.billy.spring.project.socket.repository.PrivateChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrivateChatServiceImpl implements PrivateChatService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrivateChatRepository privateChatRepository;

    @Autowired
    private PrivateChatMessageRepository privateChatMessageRepository;

   @Override
    public PrivateChat getPrivateChatByUsers(User sender, User receiver) {
        return privateChatRepository.findByUsersContainingAndUsersContaining(sender, receiver).orElse(null);
    }
   /* @Override
    public PrivateChat getPrivateChatByUsers(User sender, User receiver) {
        return privateChatRepository.findByUsersContaining(sender).stream()
                .filter(chat -> chat.getUsers().contains(receiver))
                .findFirst().orElse(null);
    }*/
    @Override
    public PrivateChat createPrivateChat(User sender, User receiver) {
        PrivateChat privateChat = new PrivateChat();
        privateChat.addUser(sender);
        privateChat.addUser(receiver);
        return privateChatRepository.save(privateChat);
    }

    @Override
    public PrivateChat getPrivateChatById(Long chatId) {
        return privateChatRepository.findById(chatId).orElse(null);
    }

    @Override
    public PrivateChatMessage savePrivateChatMessage(PrivateChatMessage privateChatMessage) {
        return privateChatMessageRepository.save(privateChatMessage);
    }

    @Override
    public PrivateChatMessage sendPrivateChatMessage(PrivateChat privateChat, User sender, User recipient, String content) {
        PrivateChatMessage privateChatMessage = new PrivateChatMessage(privateChat, sender, recipient, content);
        privateChat.addMessage(privateChatMessage);
        privateChatRepository.save(privateChat);
        return privateChatMessageRepository.save(privateChatMessage);
    }
}