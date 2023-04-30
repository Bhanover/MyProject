package com.billy.spring.project.service;

import com.billy.spring.project.controllers.ListPublicationAllController;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ContentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendshipService friendshipService;

    @Autowired
    private ListPublicationAllController listPublicationAllController;

    public List<Map<String, Object>> getCombinedUserContent(User user) {
        return listPublicationAllController.getUserContent(user.getId());
    }

    public List<Map<String, Object>> getFriendsContent(User currentUser) {
        // Obtén los IDs de los amigos del usuario
        List<Long> friendIds = friendshipService.getFriendIds(currentUser.getId());

        // Filtra los usuarios para incluir solo los amigos del usuario autenticado
        List<User> friends = userRepository.findByIdIn(friendIds);

        List<Map<String, Object>> allContent = new ArrayList<>();

        for (User friend : friends) {
            List<Map<String, Object>> friendContent = getCombinedUserContent(friend);
            allContent.addAll(friendContent);
        }

        // Ordena todo el contenido combinado por fecha de creación
        List<Map<String, Object>> combinedContent = allContent.stream()
                .sorted((map1, map2) -> {
                    LocalDateTime dateTime1 = (LocalDateTime) map1.get("creationTime");
                    LocalDateTime dateTime2 = (LocalDateTime) map2.get("creationTime");
                    return dateTime2.compareTo(dateTime1); // Ordena de manera descendente (más reciente a más antiguo)
                })
                .collect(Collectors.toList());

        // Retorna la lista completa
        return combinedContent;
    }
}