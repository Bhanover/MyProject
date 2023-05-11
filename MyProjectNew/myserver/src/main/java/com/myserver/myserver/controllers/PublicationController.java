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

    @PostMapping("/publication")
    public ResponseEntity<Publication> createPublication(@RequestBody PublicationDTO publicationDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        System.out.println("ESTO ES LA PUBLICATION"+publicationDTO);
        Publication newPublication = publicationService.createPublication(publicationDTO, user);
        return new ResponseEntity<>(newPublication, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/publications")
    public ResponseEntity<List<Map<String, Object>>> getPublications(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getId();

        // Realizando comprobaciones y controles
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<Map<String, Object>> publicationMaps = publicationService.getPublicationDetailsByUserId(id);
        return new ResponseEntity<>(publicationMaps, HttpStatus.OK);
    }
    @PutMapping("/publication/{publicationId}")
    public ResponseEntity<Publication> updatePublication(@PathVariable Long publicationId, @RequestBody PublicationDTO publicationDTO,@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        Publication updatedPublication = publicationService.updatePublication(publicationId, publicationDTO, user);
        return new ResponseEntity<>(updatedPublication, HttpStatus.OK);
    }
    @DeleteMapping("/publication/{publicationId}")
    public ResponseEntity<Void> deletePublication(@PathVariable Long publicationId,@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        publicationService.deletePublication(publicationId, user);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
