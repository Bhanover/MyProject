package com.myserver.myserver.service;


import com.myserver.myserver.exception.ResourceNotFoundException;
import com.myserver.myserver.models.*;
import com.myserver.myserver.repository.FileDBRepository;
import com.myserver.myserver.repository.PublicationRepository;
import com.myserver.myserver.repository.ReactionRepository;
import com.myserver.myserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    /*Esta función crea o actualiza una reacción de un usuario a una publicación o archivo*/
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
    /*Esta función cuenta las reacciones de un cierto tipo a una publicación.*/
    public Long countReactionsByTypeAndPublication(ReactionType type, Long publicationId) {
        Publication publication = publicationRepository.findById(publicationId).orElseThrow(() -> new ResourceNotFoundException("Publication not found with id: " + publicationId));
        return reactionRepository.countByTypeAndPublication(type, publication);
    }
    /*Esta función cuenta las reacciones de un cierto tipo a un archivo.*/
    public Long countReactionsByTypeAndFile(ReactionType type, String fileId) {
        FileDB file = fileDBRepository.findById(fileId).orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + fileId));
        return reactionRepository.countByTypeAndFile(type, file);
    }

}