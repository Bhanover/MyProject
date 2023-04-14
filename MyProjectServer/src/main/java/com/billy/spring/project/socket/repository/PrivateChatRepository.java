package com.billy.spring.project.socket.repository;
import com.billy.spring.project.models.User;
import com.billy.spring.project.socket.models.PrivateChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrivateChatRepository extends JpaRepository<PrivateChat, Long> {
    List<PrivateChat> findByUsersContaining(User user);
    @Transactional
    Optional<PrivateChat> findBySenderIdAndRecipientId(User senderId, User recipientId);
    @Transactional
    Optional<PrivateChat> findByUsersContainingAndUsersContaining(User sender, User receiver);
}
