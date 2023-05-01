package com.billy.spring.project.service;

import com.billy.spring.project.exeption.ResourceNotFoundException;
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

    public Reaction createOrUpdateReaction(Long userId, Long publicationId, String fileId, ReactionType type) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Publication publication = publicationId != null ? publicationRepository.findById(publicationId).orElseThrow(() -> new ResourceNotFoundException("Publication not found with id: " + publicationId)) : null;
        FileDB file = fileId != null ? fileDBRepository.findById(fileId).orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + fileId)) : null;

        Reaction reaction = reactionRepository.findByUserAndPublicationAndFile(user, publication, file).orElse(new Reaction());

        reaction.setUser(user);
        reaction.setPublication(publication);
        reaction.setFile(file);
        reaction.setType(type);

        return reactionRepository.save(reaction);
    }

    public Long countReactionsByTypeAndPublication(ReactionType type, Long publicationId) {
        Publication publication = publicationRepository.findById(publicationId).orElseThrow(() -> new ResourceNotFoundException("Publication not found with id: " + publicationId));
        return reactionRepository.countByTypeAndPublication(type, publication);
    }

    public Long countReactionsByTypeAndFile(ReactionType type, String fileId) {
        FileDB file = fileDBRepository.findById(fileId).orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + fileId));
        return reactionRepository.countByTypeAndFile(type, file);
    }

}