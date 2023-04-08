package com.billy.spring.project.service;
import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.Publication;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.FileDBRepository;
import com.billy.spring.project.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class PublicationServiceImpl implements PublicationService {

    @Autowired
    private PublicationRepository publicationRepository;

    @Autowired
    private FileDBRepository fileDBRepository;

    @Override
    public Publication createPublication(String content, List<FileDB> media, User user) {
        Publication publication = new Publication(content, user, media, LocalDateTime.now());
        Publication savedPublication = publicationRepository.save(publication);

        // agregamos la publicación al usuario
        user.getPublications().add(savedPublication);

        for (FileDB file : media) {
            file.setPublication(savedPublication);
            fileDBRepository.save(file);
        }

        return savedPublication;
    }
}