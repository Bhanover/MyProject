package com.billy.spring.project.models;

public class FriendInfo {
    private Long id;
    private String username;
    private boolean pending;
    private Long friendshipId;

    public FriendInfo(Long id, String username, boolean pending, Long friendshipId) {
        this.id = id;
        this.username = username;
        this.pending = pending;
        this.friendshipId = friendshipId;
    }

    // Getters y setters
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

    public boolean isPending() {
        return pending;
    }

    public void setPending(boolean pending) {
        this.pending = pending;
    }

    public Long getFriendshipId() {
        return friendshipId;
    }

    public void setFriendshipId(Long friendshipId) {
        this.friendshipId = friendshipId;
    }
}