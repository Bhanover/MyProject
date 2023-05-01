package com.billy.spring.project.repository;

import com.billy.spring.project.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndPublicationAndFile(User user, Publication publication, FileDB file);

    // Agrega estos dos métodos
    Long countByTypeAndPublication(ReactionType type, Publication publication);
    Long countByTypeAndFile(ReactionType type, FileDB file);

}
