package com.billy.spring.project.service;

import com.billy.spring.project.models.*;
import com.billy.spring.project.repository.FileDBRepository;
import com.billy.spring.project.repository.PublicationRepository;
import com.billy.spring.project.repository.ReactionRepository;
import com.billy.spring.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PublicationRepository publicationRepository;

    @Autowired
    private FileDBRepository fileDBRepository;

    public Reaction addReaction(Long publicationId, Long fileId, ReactionType type, User user) {
        Publication publication = null;
        FileDB file = null;

        if (publicationId != null) {
            publication = publicationRepository.findById(publicationId)
                    .orElseThrow(() -> new RuntimeException("Publication Not Found"));
        } else if (fileId != null) {
            file = fileDBRepository.findById(String.valueOf(fileId))
                    .orElseThrow(() -> new RuntimeException("File Not Found"));
        } else {
            throw new RuntimeException("Neither publication nor file specified");
        }

        Reaction reaction = new Reaction();
        reaction.setUser(user);
        reaction.setPublication(publication);
        reaction.setFile(file);
        reaction.setType(type);

        return reactionRepository.save(reaction);
    }

    public void deleteReaction(Long reactionId, User user) {
        Reaction reaction = reactionRepository.findById(reactionId)
                .orElseThrow(() -> new RuntimeException("Reaction Not Found"));

        if (!reaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("User Not Authorized");
        }

        reactionRepository.delete(reaction);
    }

    public Reaction toggleReaction(Long publicationId, Long fileId, ReactionType type, User user) {
        Publication publication = null;
        FileDB file = null;

        if (publicationId != null) {
            publication = publicationRepository.findById(publicationId)
                    .orElseThrow(() -> new RuntimeException("Publication Not Found"));
        } else if (fileId != null) {
            file = fileDBRepository.findById(String.valueOf(fileId))
                    .orElseThrow(() -> new RuntimeException("File Not Found"));
        } else {
            throw new RuntimeException("Neither publication nor file specified");
        }

        Reaction existingReaction = reactionRepository.findByUserAndPublicationAndFile(user, publication, file)
                .orElse(null);

        if (existingReaction == null) {
            Reaction reaction = new Reaction();
            reaction.setUser(user);
            reaction.setPublication(publication);
            reaction.setFile(file);
            reaction.setType(type);
            return reactionRepository.save(reaction);
        } else {
            if (existingReaction.getType() == type) {
                reactionRepository.delete(existingReaction);
                return null;
            } else {
                existingReaction.setType(type);
                return reactionRepository.save(existingReaction);
            }
        }
    }

    public Map<ReactionType, Long> countReactionsByType(Long publicationId, Long fileId) {
        Publication publication = null;
        FileDB file = null;

        if (publicationId != null) {
            publication = publicationRepository.findById(publicationId)
                    .orElseThrow(() -> new RuntimeException("Publication Not Found"));
        } else if (fileId != null) {
            file = fileDBRepository.findById(String.valueOf(fileId))
                    .orElseThrow(() -> new RuntimeException("File Not Found"));
        } else {
            throw new RuntimeException("Neither publication nor file specified");
        }

        Map<ReactionType, Long> counts = new HashMap<>();
        long likes = publication != null ? reactionRepository.countByPublicationAndType(publication, ReactionType.LIKE)
                : reactionRepository.countByFileAndType(file, ReactionType.LIKE);
        long dislikes = publication != null
                ? reactionRepository.countByPublicationAndType(publication, ReactionType.DISLIKE)
                : reactionRepository.countByFileAndType(file, ReactionType.DISLIKE);

        counts.put(ReactionType.LIKE, likes);
        counts.put(ReactionType.DISLIKE, dislikes);

        return counts;
    }
}

