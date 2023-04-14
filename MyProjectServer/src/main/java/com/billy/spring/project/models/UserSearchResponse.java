package com.billy.spring.project.models;

public class UserSearchResponse {
    private Long id;
    private String username;
    private String email;
    private String profileImageUrl;
    private boolean areFriends;

    public UserSearchResponse(User user, boolean areFriends) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.profileImageUrl = user.getProfileImage() != null ? user.getProfileImage().getUrl() : null;
        this.areFriends = areFriends;
    }

    // getters y setters

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

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public boolean isAreFriends() {
        return areFriends;
    }

    public void setAreFriends(boolean areFriends) {
        this.areFriends = areFriends;
    }
}