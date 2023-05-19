package com.myserver.myserver.service;


import com.myserver.myserver.controllers.ListPublicationAllController;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.UserRepository;
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
    /*Este es un método que se utiliza para obtener el contenido del usuario autenticado actual y sus amigos.
     Primero, obtiene los IDs de los amigos del usuario utilizando el friendshipService*/
    public List<Map<String, Object>> getFriendsContent(User currentUser) {
        // Obtiene los IDs de los amigos del usuario
        List<Long> friendIds = friendshipService.getFriendIds(currentUser.getId());

        // Filtra los usuarios para incluir solo los amigos del usuario autenticado
        List<User> friends = userRepository.findByIdIn(friendIds);

        List<Map<String, Object>> allContent = new ArrayList<>();

        for (User friend : friends) {
            List<Map<String, Object>> friendContent = getCombinedUserContent(friend);
            allContent.addAll(friendContent);
        }

        // Obtiene el contenido del usuario actual
        List<Map<String, Object>> currentUserContent = getCombinedUserContent(currentUser);

        // Añade el contenido del usuario actual a la lista allContent
        allContent.addAll(currentUserContent);

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