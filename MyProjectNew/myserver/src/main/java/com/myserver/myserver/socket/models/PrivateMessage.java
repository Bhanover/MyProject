package com.myserver.myserver.socket.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "private_messages")
public class PrivateMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String senderId;
    private String recipientId;
    private String message;
    private String roomName;
    private String senderUsername;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    // Getters and setters


}
