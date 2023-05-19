package com.myserver.myserver.controllers;


import com.myserver.myserver.dto.PublicationDTO;
import com.myserver.myserver.models.Publication;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.service.UserDetailsImpl;
import com.myserver.myserver.service.PublicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class PublicationController {

    @Autowired
    private PublicationService publicationService;

    @Autowired
    private UserRepository userRepository;
    /*Este método se utiliza para crear una nueva publicación*/
    @PostMapping("/publication")
    public ResponseEntity<Publication> createPublication(@RequestBody PublicationDTO publicationDTO) {
        /*Esto se usa para la autenticación del usuario*/
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        Publication newPublication = publicationService.createPublication(publicationDTO, user);
        return new ResponseEntity<>(newPublication, HttpStatus.CREATED);
    }
    /*Este método se utiliza para obtener todas las publicaciones de un usuario específico.*/
    /* @AuthenticationPrincipal con esto se comprueba que el que accede al recurso este autenticado*/
    @GetMapping("/{id}/publications")
    public ResponseEntity<List<Map<String, Object>>> getPublications(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Long userId = userDetails.getId();

        // Realizando comprobaciones y controles
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        /*se llama al servicio de publicaciones para obtener una lista
         de mapas de detalles de publicaciones por el id del usuario. */
        List<Map<String, Object>> publicationMaps = publicationService.getPublicationDetailsByUserId(id);
        return new ResponseEntity<>(publicationMaps, HttpStatus.OK);
    }
    /*- Este método se utiliza para actualizar una publicación existente.*/
    /*Aquí, se toma un publicationId como parte de la URL de la solicitud HTTP PUT,
     y se toma un PublicationDTO como entrada en el cuerpo de la solicitud.*/
    @PutMapping("/publication/{publicationId}")
    public ResponseEntity<Publication> updatePublication(@PathVariable Long publicationId, @RequestBody PublicationDTO publicationDTO,@AuthenticationPrincipal UserDetailsImpl userDetails) {
        /*Se obtiene el usuario de la base de datos utilizando el repositorio de users*/
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        Publication updatedPublication = publicationService.updatePublication(publicationId, publicationDTO, user);
        return new ResponseEntity<>(updatedPublication, HttpStatus.OK);
    }
    /*Este método se utiliza para eliminar una publicación existente.*/
    @DeleteMapping("/publication/{publicationId}")
    public ResponseEntity<Void> deletePublication(@PathVariable Long publicationId,@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        publicationService.deletePublication(publicationId, user);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
