package com.billy.spring.project.socket.repository;

import com.billy.spring.project.socket.models.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Transactional
    Optional<Chat> findBySenderIdAndRecipientId(Long senderId, Long recipientId);
}
