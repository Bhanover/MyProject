package com.billy.spring.project.socket.models;
import com.billy.spring.project.models.User;



import javax.persistence.*;

@Entity
@Table(name = "chat_messages")

public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chatId;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User senderId;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipientId;
    private String content;



    // Getters, setters, and constructors


    public ChatMessage(Long id, Chat chatId, User senderId, User recipientId, String content) {
        this.id = id;
        this.chatId = chatId;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
    }

    public ChatMessage() {

    }

    public ChatMessage(User senderId, User recipientId, String content) {
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
    }

    public ChatMessage(Chat chatId, User senderId, User recipientId, String content) {
        this.chatId = chatId;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Chat getChatId() {
        return chatId;
    }

    public void setChatId(Chat chatId) {
        this.chatId = chatId;
    }

    public User getSenderId() {
        return senderId;
    }

    public void setSenderId(User senderId) {
        this.senderId = senderId;
    }

    public User getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(User recipientId) {
        this.recipientId = recipientId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}