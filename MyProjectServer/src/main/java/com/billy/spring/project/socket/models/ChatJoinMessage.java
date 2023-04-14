package com.billy.spring.project.socket.models;

import com.billy.spring.project.models.User;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;




public class ChatJoinMessage {
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User senderId;

    public ChatJoinMessage(User senderId) {
        this.senderId = senderId;


    }

    public User getSenderId() {
        return senderId;
    }

    public void setSenderId(User senderId) {
        this.senderId = senderId;
    }
}