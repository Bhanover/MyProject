package com.billy.spring.project.models;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.*;

import com.billy.spring.project.socket.models.ChatMessage;
import com.billy.spring.project.socket.models.PrivateChat;
import com.billy.spring.project.socket.models.PrivateChatMessage;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

/*@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(max = 120)
  private String password;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "profile_image_id", referencedColumnName = "id")
  private FileDB profileImage;

  private String jwtToken;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  private List<FileDB> files;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Publication> publications;


  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Friendship> friendships;

  @OneToMany(mappedBy = "friend", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Friendship> friends;



  @OneToMany(mappedBy = "user")
  private List<RoomUser> rooms;



  public List<Publication> getPublications() {
    return publications;
  }

  public void setPublications(List<Publication> publications) {
    this.publications = publications;
  }


  public List<Friendship> getFriendships() {
    return friendships;
  }

  public void setFriendships(List<Friendship> friendships) {
    this.friendships = friendships;
  }

  public List<Friendship> getFriends() {
    return friends;
  }

  public void setFriends(List<Friendship> friends) {
    this.friends = friends;
  }

  public User() {
  }

  public User(Long id, String username, String email, String password, FileDB profileImage, String jwtToken, List<FileDB> files, List<Publication> publications, List<Friendship> friendships, List<Friendship> friends) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.profileImage = profileImage;
    this.jwtToken = jwtToken;
    this.files = files;
    this.publications = publications;
    this.friendships = friendships;
    this.friends = friends;
  }

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  public String getJwtToken() {
    return jwtToken;
  }

  public void setJwtToken(String jwtToken) {
    this.jwtToken = jwtToken;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public FileDB getProfileImage() {
    return profileImage;
  }

  public void setProfileImage(FileDB profileImage) {
    this.profileImage = profileImage;
  }

  public List<FileDB> getFiles() {
    return files;
  }

  public void setFiles(List<FileDB> files) {
    this.files = files;
  }
}*/


@Entity
@Table(name = "users", uniqueConstraints = {
          @UniqueConstraint(columnNames = "username"),
          @UniqueConstraint(columnNames = "email")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_image_id", referencedColumnName = "id")
    private FileDB profileImage;

    private String jwtToken;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<FileDB> files;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Publication> publications;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Friendship> friendships;

    @OneToMany(mappedBy = "friend", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Friendship> friends;

    // Add new relationships for Chat and PrivateChat entities
    // Add new relationships for Chat and PrivateChat entities
    @OneToMany(mappedBy = "senderId", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ChatMessage> sentMessages;

    @OneToMany(mappedBy = "recipientId", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ChatMessage> receivedMessages;

    @OneToMany(mappedBy = "senderId", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PrivateChatMessage> sentPrivateChatMessages;

    @OneToMany(mappedBy = "recipientId", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PrivateChatMessage> receivedPrivateChatMessages;

    @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<PrivateChat> privateChats;

    // constructors, getters, and setters


    public User() {
    }

    public User(Long id, String username, String email, String password, FileDB profileImage, String jwtToken, List<FileDB> files, List<Publication> publications, List<Friendship> friendships, List<Friendship> friends, List<ChatMessage> sentMessages, List<ChatMessage> receivedMessages, List<PrivateChatMessage> sentPrivateChatMessages, List<PrivateChatMessage> receivedPrivateChatMessages, Set<PrivateChat> privateChats) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;
      this.profileImage = profileImage;
      this.jwtToken = jwtToken;
      this.files = files;
      this.publications = publications;
      this.friendships = friendships;
      this.friends = friends;
      this.sentMessages = sentMessages;
      this.receivedMessages = receivedMessages;
      this.sentPrivateChatMessages = sentPrivateChatMessages;
      this.receivedPrivateChatMessages = receivedPrivateChatMessages;
      this.privateChats = privateChats;
    }

    public User(String username, String email, String password) {
      this.username = username;
      this.email = email;
      this.password = password;
    }

    public Long getId() {
      return id;
    }

    public void setId(Long id) {
      this.id = id;
    }

    public String getUsername() {
      return username;
    }

    public void setUsername(String username) {
      this.username = username;
    }

    public String getEmail() {
      return email;
    }

    public void setEmail(String email) {
      this.email = email;
    }

    public String getPassword() {
      return password;
    }

    public void setPassword(String password) {
      this.password = password;
    }

    public FileDB getProfileImage() {
      return profileImage;
    }

    public void setProfileImage(FileDB profileImage) {
      this.profileImage = profileImage;
    }

    public String getJwtToken() {
      return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
      this.jwtToken = jwtToken;
    }

    public List<FileDB> getFiles() {
      return files;
    }

    public void setFiles(List<FileDB> files) {
      this.files = files;
    }

    public List<Publication> getPublications() {
      return publications;
    }

    public void setPublications(List<Publication> publications) {
      this.publications = publications;
    }

    public List<Friendship> getFriendships() {
      return friendships;
    }

    public void setFriendships(List<Friendship> friendships) {
      this.friendships = friendships;
    }

    public List<Friendship> getFriends() {
      return friends;
    }

    public void setFriends(List<Friendship> friends) {
      this.friends = friends;
    }

    public List<ChatMessage> getSentMessages() {
      return sentMessages;
    }

    public void setSentMessages(List<ChatMessage> sentMessages) {
      this.sentMessages = sentMessages;
    }

    public List<ChatMessage> getReceivedMessages() {
      return receivedMessages;
    }

    public void setReceivedMessages(List<ChatMessage> receivedMessages) {
      this.receivedMessages = receivedMessages;
    }

    public List<PrivateChatMessage> getSentPrivateChatMessages() {
      return sentPrivateChatMessages;
    }

    public void setSentPrivateChatMessages(List<PrivateChatMessage> sentPrivateChatMessages) {
      this.sentPrivateChatMessages = sentPrivateChatMessages;
    }

    public List<PrivateChatMessage> getReceivedPrivateChatMessages() {
      return receivedPrivateChatMessages;
    }

    public void setReceivedPrivateChatMessages(List<PrivateChatMessage> receivedPrivateChatMessages) {
      this.receivedPrivateChatMessages = receivedPrivateChatMessages;
    }

    public Set<PrivateChat> getPrivateChats() {
      return privateChats;
    }

    public void setPrivateChats(Set<PrivateChat> privateChats) {
      this.privateChats = privateChats;
    }
  }
