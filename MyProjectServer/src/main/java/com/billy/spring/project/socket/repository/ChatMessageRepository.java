package com.billy.spring.project.socket.repository;

import com.billy.spring.project.socket.models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Transactional
    ChatMessage save(ChatMessage chatMessage);

}