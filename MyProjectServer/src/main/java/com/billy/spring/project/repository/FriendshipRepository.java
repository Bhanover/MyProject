package com.billy.spring.project.repository;

import com.billy.spring.project.models.Friendship;
import com.billy.spring.project.models.FriendshipStatus;
import com.billy.spring.project.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    List<Friendship> findByUser_IdAndStatusOrFriend_IdAndStatus(Long userId, FriendshipStatus status1, Long friendId, FriendshipStatus status2);

    List<Friendship> findByUserAndStatus(User user, FriendshipStatus status);
    List<Friendship> findByFriendAndStatus(User friend, FriendshipStatus status);
    Optional<Friendship> findByUserAndFriend(User user, User friend);
   /* Optional<Friendship> findByUserIdAndFriendId(Long userId, Long friendId);*/
   Optional<Friendship> findByUser_IdAndFriend_Id(Long userId, Long friendId);
    List<Friendship> findByUser(User user);
    List<Friendship> findByFriend(User user);
    Optional<Friendship> findByUserIdAndFriendIdOrFriendIdAndUserId(Long userId, Long friendId, Long userId2, Long friendId2);
    Optional<Friendship> findByUserIdAndFriendId(Long userId, Long friendId);

}