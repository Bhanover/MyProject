package com.billy.spring.project.repository;

import com.billy.spring.project.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndPublicationAndFile(User user, Publication publication, FileDB file);
    long countByPublicationAndType(Publication publication, ReactionType type);
    long countByFileAndType(FileDB file, ReactionType type);
}
