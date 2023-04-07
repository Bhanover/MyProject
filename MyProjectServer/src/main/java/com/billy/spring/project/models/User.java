package com.billy.spring.project.models;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

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


  private FileDB profileImage;

  private String jwtToken;


  private List<FileDB> files;

  public User() {
  }

  public User(Long id, String username, String email, String password, FileDB profileImage, String jwtToken) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.profileImage = profileImage;
    this.jwtToken = jwtToken;
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
}