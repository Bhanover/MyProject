package com.billy.spring.project.socket.models;

import com.billy.spring.project.models.User;


import javax.persistence.Entity;
import javax.persistence.Table;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity

@Table(name = "private_chats")
public class PrivateChat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long senderId;
    private Long recipientId;

    @ManyToMany
    @JoinTable(
            name = "private_chat_users",
            joinColumns = @JoinColumn(name = "private_chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();
    @OneToMany(mappedBy = "privateChatId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrivateChatMessage> privateChatMessages = new ArrayList<>();
    public PrivateChat() {
        this.privateChatMessages = new ArrayList<>();
    }

    // Getters, setters, and constructors
    public void addMessage(PrivateChatMessage privateChatMessage) {
        privateChatMessage.setPrivateChatId(this);
        privateChatMessages.add(privateChatMessage);
    }

    public void addUser(User user) {
        if (users == null) {
            users = new HashSet<>();
        }
        users.add(user);
    }

    public PrivateChat(Long id, Long senderId, Long recipientId, Set<User> users) {
        this.id = id;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.users = users;
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

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}

