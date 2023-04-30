package com.billy.spring.project.service;

import com.billy.spring.project.models.FriendInfo;
import com.billy.spring.project.models.Friendship;
import com.billy.spring.project.models.FriendshipStatus;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.FriendshipRepository;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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

  /*  public List<User> getFriends(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        List<Friendship> sentFriendships = friendshipRepository.findByUserAndStatus(user, FriendshipStatus.ACCEPTED);
        List<Friendship> receivedFriendships = friendshipRepository.findByFriendAndStatus(user, FriendshipStatus.ACCEPTED);

        List<User> friends = new ArrayList<>();
        for (Friendship friendship : sentFriendships) {
            friends.add(friendship.getFriend());
        }
        for (Friendship friendship : receivedFriendships) {
            friends.add(friendship.getUser());
        }

        return friends;
    }*/
  public List<FriendInfo> getFriends(Long userId) {
      User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
      List<Friendship> sentFriendships = friendshipRepository.findByUser(user);
      List<Friendship> receivedFriendships = friendshipRepository.findByFriend(user);

      List<FriendInfo> friends = new ArrayList<>();
      for (Friendship friendship : sentFriendships) {
          friends.add(new FriendInfo(friendship.getFriend().getId(), friendship.getFriend().getUsername(), friendship.getStatus() == FriendshipStatus.PENDING, friendship.getId()));
      }
      for (Friendship friendship : receivedFriendships) {
          friends.add(new FriendInfo(friendship.getUser().getId(), friendship.getUser().getUsername(), friendship.getStatus() == FriendshipStatus.PENDING, friendship.getId()));
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
   /* public void removeFriend(Long userId, Long friendId) {
        Optional<Friendship> friendshipOptional = friendshipRepository.findByUserIdAndFriendId(userId, friendId);
        if (friendshipOptional.isPresent()) {
            Friendship friendship = friendshipOptional.get();
            friendshipRepository.delete(friendship);
        }
    }*/
}
