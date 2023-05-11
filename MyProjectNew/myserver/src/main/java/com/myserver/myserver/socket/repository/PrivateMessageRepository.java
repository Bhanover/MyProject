package com.myserver.myserver.socket.repository;


import com.myserver.myserver.socket.models.PrivateMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrivateMessageRepository extends JpaRepository<PrivateMessage, Long> {
    List<PrivateMessage> findByRoomNameOrderByTimestampAsc(String roomName);
    List<PrivateMessage> findBySenderIdAndRecipientIdOrRecipientIdAndSenderIdOrderByTimestampAsc(
            String senderId, String recipientId, String recipientId2, String senderId2);

    @Query("SELECT pm FROM PrivateMessage pm WHERE (pm.senderUsername = :sender AND pm.recipientId = :recipient) OR (pm.senderUsername = :recipient AND pm.recipientId = :sender) ORDER BY pm.timestamp ASC")
    List<PrivateMessage> findChatHistory(String sender, String recipient);
}
