package com.billy.spring.project.payload.response;

import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private String text;
    private LocalDateTime createdAt;
    private String authorUsername;
    private Long authorId;
    public CommentResponse() {
    }

    public CommentResponse(Long id, String text, LocalDateTime createdAt, String authorUsername, Long authorId) {
        this.id = id;
        this.text = text;
        this.createdAt = createdAt;
        this.authorUsername = authorUsername;
        this.authorId = authorId;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }
}
