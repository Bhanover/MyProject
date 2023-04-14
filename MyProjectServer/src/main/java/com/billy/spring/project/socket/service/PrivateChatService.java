package com.billy.spring.project.socket.service;

import com.billy.spring.project.models.User;
import com.billy.spring.project.socket.models.PrivateChat;
import com.billy.spring.project.socket.models.PrivateChatMessage;
import org.springframework.stereotype.Service;

@Service
public interface PrivateChatService {
    PrivateChat getPrivateChatByUsers(User sender, User receiver);
    PrivateChat createPrivateChat(User sender, User receiver);
    PrivateChat getPrivateChatById(Long chatId);
    PrivateChatMessage savePrivateChatMessage(PrivateChatMessage privateChatMessage);

    PrivateChatMessage sendPrivateChatMessage(PrivateChat privateChat, User sender, User recipient, String content);

}