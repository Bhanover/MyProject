package com.billy.spring.project.service;

import com.billy.spring.project.dto.PublicationDTO;
import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.Publication;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PublicationService {
    @Autowired
    private PublicationRepository publicationRepository;

    public Publication createPublication(PublicationDTO publicationDTO, User user) {
        Publication publication = new Publication();
        publication.setContent(publicationDTO.getContent());
        publication.setCreationTime(LocalDateTime.now());
        publication.setUser(user);

        return publicationRepository.save(publication);
    }

    public List<Publication> getPublicationsByUser(User user) {
        return publicationRepository.findByUser(user);
    }
    private User getCurrentUser() {
        // aquí iría la lógica para obtener el usuario actual (ejemplo)
        return new User("usuario", "usuario@example.com", "123456");
    }


}
