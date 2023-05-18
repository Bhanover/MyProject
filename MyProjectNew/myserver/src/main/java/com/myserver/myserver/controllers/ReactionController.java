package com.myserver.myserver.controllers;


import com.myserver.myserver.models.Reaction;
import com.myserver.myserver.models.ReactionType;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.service.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class ReactionController {
    @Autowired
    private ReactionService reactionService;

    @Autowired
    private UserRepository userRepository;



    /*Este método recibe los valores de los parámetros de ruta y los utiliza para
        contar las reacciones de un tipo específico (type) en una publicación identificada por su ID (publicationId)*/
    @GetMapping("/count/{type}/publication/{publicationId}")
    public ResponseEntity<Long> countReactionsByTypeAndPublication(@PathVariable ReactionType type, @PathVariable Long publicationId) {
        Long count = reactionService.countReactionsByTypeAndPublication(type, publicationId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    /*Este método recibe los valores de los parámetros de ruta y los utiliza para
     contar las reacciones en un archivo identificado por su ID (fileId))*/
    @GetMapping("/count/{type}/file/{fileId}")
    public ResponseEntity<Long> countReactionsByTypeAndFile(@PathVariable ReactionType type, @PathVariable String fileId) {
        Long count = reactionService.countReactionsByTypeAndFile(type, fileId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    /*Este método maneja la acción de me gusta*/
    /* Recibe un parámetro opcional publicationId que representa la publicación en la que se realiza el "me gusta"*/
    @PostMapping("/like")
    public ResponseEntity<Reaction> like(@RequestParam(required = false) Long publicationId, @RequestParam(required = false) String fileId, Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new RuntimeException("User Not Found"));
        Reaction reaction = reactionService.createOrUpdateReaction(user.getId(), publicationId, fileId, ReactionType.LIKE);
        return new ResponseEntity<>(reaction, HttpStatus.CREATED);
    }

    /*Este método maneja la acción de no me gusta*/
    /* Recibe un parámetro  opcional fileId que representa el archivo en el que se realiza el "me gusta" */
    @PostMapping("/dislike")
    public ResponseEntity<Reaction> dislike(@RequestParam(required = false) Long publicationId, @RequestParam(required = false) String fileId, Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new RuntimeException("User Not Found"));
        Reaction reaction = reactionService.createOrUpdateReaction(user.getId(), publicationId, fileId, ReactionType.DISLIKE);
        return new ResponseEntity<>(reaction, HttpStatus.CREATED);
    }
}
