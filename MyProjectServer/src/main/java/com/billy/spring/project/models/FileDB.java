package com.billy.spring.project.models;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "files")
public class FileDB {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    private String filename;

    private String contentType;

    @Lob
    private byte[] bytes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @OneToOne(mappedBy = "profileImage", fetch = FetchType.LAZY)
    private User profileUser;

    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publication_id", nullable = true)
    @JsonIgnore // Agregar esta anotación para evitar la recursión infinita
    private Publication publication;

    public Publication getPublication() {
        return publication;
    }
    public FileDB() {
    }
    public FileDB(String id, String filename, String contentType, byte[] bytes, User user, User profileUser, String url, Publication publication) {
        this.id = id;
        this.filename = filename;
        this.contentType = contentType;
        this.bytes = bytes;
        this.user = user;
        this.profileUser = profileUser;
        this.url = url;
        this.publication = publication;
    }


    // Agregar un constructor que excluya el atributo "publication"
    public FileDB(String filename, String contentType, byte[] bytes) {
        this.filename = filename;
        this.contentType = contentType;
        this.bytes = bytes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public byte[] getBytes() {
        return bytes;
    }

    public void setBytes(byte[] bytes) {
        this.bytes = bytes;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getProfileUser() {
        return profileUser;
    }

    public void setProfileUser(User profileUser) {
        this.profileUser = profileUser;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setPublication(Publication publication) {
        this.publication = publication;
    }
}