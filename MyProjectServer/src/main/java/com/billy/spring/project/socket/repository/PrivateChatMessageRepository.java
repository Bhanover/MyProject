package com.billy.spring.project.socket.repository;
import com.billy.spring.project.socket.models.PrivateChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrivateChatMessageRepository extends JpaRepository<PrivateChatMessage, Long> {

    @Transactional
    PrivateChatMessage save(PrivateChatMessage privateChatMessage);
    List<PrivateChatMessage> findByPrivateChatId(Long privateChatId);

}
