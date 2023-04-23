package com.billy.spring.project.models;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 500)
    private String text;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="file_id")
    @JsonIgnore

    private FileDB file;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    @JsonIgnore

    private User user;

    private LocalDateTime creationTime;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publication_id")
    private Publication publication;

    public Comment() {
    }
    public Comment(String text, Publication publication, User user) {
        this.text = text;
        this.publication = publication;
        this.user = user;
        this.creationTime = LocalDateTime.now();
    }
    public Comment(String text, FileDB file, User user) {
        this.text = text;
        this.file = file;
        this.user = user;
        this.creationTime = LocalDateTime.now();
    }

    public Comment(Long id, String text, FileDB file, User user, LocalDateTime creationTime) {
        this.id = id;
        this.text = text;
        this.file = file;
        this.user = user;
        this.creationTime = creationTime;
    }



    public Comment(String text, User user, Publication publication) {
        this.text = text;
        this.user = user;
        this.publication = publication;
    }
// Getters and setters omitted for brevity

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public FileDB getFile() {
        return file;
    }

    public void setFile(FileDB file) {
        this.file = file;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(LocalDateTime creationTime) {
        this.creationTime = creationTime;
    }
}