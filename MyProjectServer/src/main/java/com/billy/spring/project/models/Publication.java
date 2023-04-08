package com.billy.spring.project.models;
import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "publications")
public class Publication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "publication", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<FileDB> media;

    @Column(name = "creation_time")
    private LocalDateTime creationTime;

    public Publication() {
    }

    public Publication(String content, User user, List<FileDB> media, LocalDateTime creationTime) {
        this.content = content;
        this.user = user;
        this.media = media;
        this.creationTime = creationTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<FileDB> getMedia() {
        return media;
    }

    public void setMedia(List<FileDB> media) {
        this.media = media;
    }

    public LocalDateTime getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(LocalDateTime creationTime) {
        this.creationTime = creationTime;
    }
}