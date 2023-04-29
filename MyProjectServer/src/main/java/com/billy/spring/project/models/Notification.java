package com.billy.spring.project.models;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;


@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String type;
    private String content;
    @Column(name = "is_read")
    private boolean isRead;

    private LocalDateTime createdAt;

    // Getters, setters y otros métodos relevantes
}