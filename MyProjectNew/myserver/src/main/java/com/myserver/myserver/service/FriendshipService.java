package com.myserver.myserver.service;

import com.myserver.myserver.models.Friendship;
import com.myserver.myserver.models.FriendshipStatus;
import com.myserver.myserver.models.Notification;
import com.myserver.myserver.models.User;
import com.myserver.myserver.payload.response.FriendInfo;
import com.myserver.myserver.repository.FriendshipRepository;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendshipService {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;
    public Friendship getFriendshipStatus(Long userId, Long friendId) {
        return friendshipRepository.findByUserIdAndFriendIdOrFriendIdAndUserId(userId, friendId, userId, friendId)
                .orElse(new Friendship(userId, friendId, null));
    }

    public Friendship sendFriendRequest(Long userId, Long friendId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        User friend = userRepository.findById(friendId).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + friendId));

        Friendship friendship = new Friendship();
        friendship.setUser(user);
        friendship.setFriend(friend);
        friendship.setStatus(FriendshipStatus.PENDING);
        friendship.setCreatedAt(LocalDateTime.now());

        return friendshipRepository.save(friendship);
    }
    public boolean areFriends(Long userId, Long friendId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        Optional<User> optionalFriend = userRepository.findById(friendId);

        if (optionalUser.isPresent() && optionalFriend.isPresent()) {
            User user = optionalUser.get();
            User friend = optionalFriend.get();

            Optional<Friendship> friendship = friendshipRepository.findByUserAndFriend(user, friend);

            return friendship.isPresent();        }

        return false;
    }
    public Friendship getFriendshipById(Long friendshipId) {
        return friendshipRepository.findById(friendshipId).orElseThrow(() -> new RuntimeException("Friendship Not Found"));
    }
    public Optional<Friendship> findFriendshipById(Long friendshipId) {
        return friendshipRepository.findById(friendshipId);
    }
    public void acceptFriendRequest(Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId).orElseThrow(() -> new IllegalArgumentException("Friendship not found with id: " + friendshipId));

        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new IllegalStateException("Cannot accept friend request with status " + friendship.getStatus());
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);
    }

    public void rejectFriendRequest(Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId).orElseThrow(() -> new IllegalArgumentException("Friendship not found with id: " + friendshipId));

        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new IllegalStateException("Cannot reject friend request with status " + friendship.getStatus());
        }

        friendship.setStatus(FriendshipStatus.REJECTED);
        friendshipRepository.save(friendship);
    }
    public List<FriendInfo> getFriends(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        List<Friendship> sentFriendships = friendshipRepository.findByUser(user);
        List<Friendship> receivedFriendships = friendshipRepository.findByFriend(user);

        List<FriendInfo> friends = new ArrayList<>();
        for (Friendship friendship : sentFriendships) {
            friends.add(new FriendInfo(friendship.getFriend().getId(), friendship.getFriend().getProfileImage().getUrl(), friendship.getFriend().getUsername(), friendship.getStatus() == FriendshipStatus.PENDING, friendship.getId()));
        }
        for (Friendship friendship : receivedFriendships) {
            // Use friendship.getUser() instead of friendship.getFriend()
            friends.add(new FriendInfo(friendship.getUser().getId(), friendship.getUser().getProfileImage().getUrl(), friendship.getUser().getUsername(), friendship.getStatus() == FriendshipStatus.PENDING, friendship.getId()));
        }

        return friends;
    }
    public void removeFriend(Long friendshipId) {
        Optional<Friendship> optionalFriendship = friendshipRepository.findById(friendshipId);

        if (optionalFriendship.isPresent()) {
            Friendship friendship = optionalFriendship.get();
            if (friendship.getStatus() == FriendshipStatus.ACCEPTED) {
                friendshipRepository.delete(friendship);
            } else {
                System.out.println("The friendship status is not accepted."); // Agrega esta línea
                throw new RuntimeException("The friendship status is not accepted.");
            }
        } else {
            System.out.println("Friendship not found."); // Agrega esta línea
            throw new RuntimeException("Friendship not found.");
        }
    }
    public List<Long> getFriendIds(Long userId) {
        List<Friendship> friendships = friendshipRepository.findByUser_IdAndStatusOrFriend_IdAndStatus(
                userId, FriendshipStatus.ACCEPTED,
                userId, FriendshipStatus.ACCEPTED
        );

        List<Long> friendIds = new ArrayList<>();
        for (Friendship friendship : friendships) {
            if (friendship.getUser().getId().equals(userId)) {
                friendIds.add(friendship.getFriend().getId());
            } else {
                friendIds.add(friendship.getUser().getId());
            }
        }
        return friendIds;
    }
}