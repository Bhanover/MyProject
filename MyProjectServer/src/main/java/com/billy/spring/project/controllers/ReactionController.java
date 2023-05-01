package com.billy.spring.project.controllers;

import com.billy.spring.project.models.Reaction;
import com.billy.spring.project.models.ReactionType;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.service.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class ReactionController {
    @Autowired
    private ReactionService reactionService;

    @Autowired
    private UserRepository userRepository;




    @GetMapping("/count/{type}/publication/{publicationId}")
    public ResponseEntity<Long> countReactionsByTypeAndPublication(@PathVariable ReactionType type, @PathVariable Long publicationId) {
        Long count = reactionService.countReactionsByTypeAndPublication(type, publicationId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/count/{type}/file/{fileId}")
    public ResponseEntity<Long> countReactionsByTypeAndFile(@PathVariable ReactionType type, @PathVariable String fileId) {
        Long count = reactionService.countReactionsByTypeAndFile(type, fileId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    @PostMapping("/like")
    public ResponseEntity<Reaction> like(@RequestParam(required = false) Long publicationId, @RequestParam(required = false) String fileId, Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new RuntimeException("User Not Found"));
        Reaction reaction = reactionService.createOrUpdateReaction(user.getId(), publicationId, fileId, ReactionType.LIKE);
        return new ResponseEntity<>(reaction, HttpStatus.CREATED);
    }

    @PostMapping("/dislike")
    public ResponseEntity<Reaction> dislike(@RequestParam(required = false) Long publicationId, @RequestParam(required = false) String fileId, Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new RuntimeException("User Not Found"));
        Reaction reaction = reactionService.createOrUpdateReaction(user.getId(), publicationId, fileId, ReactionType.DISLIKE);
        return new ResponseEntity<>(reaction, HttpStatus.CREATED);
    }
}
