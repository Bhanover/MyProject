package com.billy.spring.project.socket.models;
import com.billy.spring.project.models.User;

import javax.persistence.*;
@Entity

@Table(name = "private_chat_messages")
public class PrivateChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "private_chat_id", nullable = false)
    private PrivateChat privateChatId;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User senderId;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipientId;

    private String content;

    // Getters, setters, and constructors


    public PrivateChatMessage() {
    }

    public PrivateChatMessage(Long id, PrivateChat privateChatId, User senderId, User recipientId, String content) {
        this.id = id;
        this.privateChatId = privateChatId;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
    }

    public PrivateChatMessage(PrivateChat privateChatId, User senderId, User recipientId, String content) {
        this.privateChatId = privateChatId;
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

    public PrivateChat getPrivateChatId() {
        return privateChatId;
    }

    public void setPrivateChatId(PrivateChat privateChatId) {
        this.privateChatId = privateChatId;
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
