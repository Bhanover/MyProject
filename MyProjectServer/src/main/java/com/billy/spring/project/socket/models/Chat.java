package com.billy.spring.project.socket.models;


import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chats")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long senderId;
    private Long recipientId;

    @OneToMany(mappedBy = "chatId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages = new ArrayList<>();

    // Getters, setters, and constructors


    public Chat(Long senderId, Long recipientId) {
        this.senderId = senderId;
        this.recipientId = recipientId;
    }
    public void addMessage(ChatMessage chatMessage) {
        chatMessage.setChatId(this);
        messages.add(chatMessage);
    }

    public Chat() {
    }

    public Chat(Long id, Long senderId, Long recipientId, List<ChatMessage> messages) {
        this.id = id;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.messages = messages;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }
}