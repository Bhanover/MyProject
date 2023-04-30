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

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class ReactionController {
    @Autowired
    private ReactionService reactionService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/publications/{publicationId}/reactions")
    public ResponseEntity<Reaction> addReaction(@PathVariable Long publicationId,
                                                @RequestParam ReactionType type,
                                                @RequestParam(value = "fileId", required = false) Long fileId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Reaction reaction = reactionService.addReaction(publicationId, fileId, type, user);
        return ResponseEntity.ok(reaction);
    }
    @GetMapping("/reactions/count")
    public ResponseEntity<Map<ReactionType, Long>> getReactionCounts(@RequestParam(value = "publicationId", required = false) Long publicationId,
                                                                     @RequestParam(value = "fileId", required = false) Long fileId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<ReactionType, Long> reactionCounts = reactionService.countReactionsByType(publicationId, fileId);
        return ResponseEntity.ok(reactionCounts);
    }
    @DeleteMapping("/reactions/{reactionId}")
    public ResponseEntity<Void> deleteReaction(@PathVariable Long reactionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        reactionService.deleteReaction(reactionId, user);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reactions")
    public ResponseEntity<Reaction> toggleReaction(@RequestParam(value = "publicationId", required = false) Long publicationId,
                                                   @RequestParam(value = "fileId", required = false) Long fileId,
                                                   @RequestBody ReactionType type) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Reaction reaction = reactionService.toggleReaction(publicationId, fileId, type, user);
        return ResponseEntity.ok(reaction);
    }
}
