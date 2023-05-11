package com.myserver.myserver.repository;


import com.myserver.myserver.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndPublicationAndFile(User user, Publication publication, FileDB file);
    Long countByTypeAndPublication(ReactionType type, Publication publication);
    Long countByTypeAndFile(ReactionType type, FileDB file);

}
