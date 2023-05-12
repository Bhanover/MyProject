package com.myserver.myserver.service;


import com.myserver.myserver.dto.PublicationDTO;
import com.myserver.myserver.models.FileDB;
import com.myserver.myserver.models.Publication;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.PublicationRepository;
import com.myserver.myserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PublicationService {
    @Autowired
    private PublicationRepository publicationRepository;
    @Autowired
    private UserRepository userRepository;
    final  String defaultImageUrl = "https://res.cloudinary.com/dhqfopwka/image/upload/v1683919422/defaultImage/defaultAvatar_f4vs3m.jpg";


    public Publication createPublication(PublicationDTO publicationDTO, User user) {
        Publication publication = new Publication();
        publication.setContent(publicationDTO.getContent());
        publication.setCreationTime(LocalDateTime.now());
        publication.setUser(user);
        return publicationRepository.save(publication);
    }

    public List<Map<String, Object>> getPublicationDetailsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        List<Publication> publications = publicationRepository.findByUser(user);

        // Convertir las publicaciones en un Map<String, Object>
        List<Map<String, Object>> publicationMaps = publications.stream().map(publication -> {
            Map<String, Object> publicationMap = new HashMap<>();
            publicationMap.put("id", publication.getId());
            publicationMap.put("content", publication.getContent());
            publicationMap.put("creationTime", publication.getCreationTime());
            publicationMap.put("userId", publication.getUser().getId());
            publicationMap.put("username", publication.getUser().getUsername());

            FileDB profileImage = publication.getUser().getProfileImage();
            String profileImageUrl = profileImage != null ? profileImage.getUrl() : defaultImageUrl;
            publicationMap.put("profileImageUrl", profileImageUrl);

            return publicationMap;
        }).collect(Collectors.toList());

        return publicationMaps;
    }

    public Publication updatePublication(Long publicationId, PublicationDTO publicationDTO, User user) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication Not Found"));
        if (!publication.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to edit this publication");
        }
        publication.setContent(publicationDTO.getContent());
        return publicationRepository.save(publication);
    }
    public void deletePublication(Long publicationId, User user) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication Not Found"));

        if (!publication.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this publication");
        }

        publicationRepository.deleteById(publicationId);
    }
}
