package com.billy.spring.project.controllers;
import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.Publication;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.service.PublicationService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class PublicationController {

    @Autowired
    private PublicationService publicationService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private Cloudinary cloudinary;

    @PostMapping("/publications")
    public ResponseEntity<Publication> createPublication(@RequestParam(value = "content") String content,
                                                         @RequestParam(value = "media", required = false) List<MultipartFile> mediaFiles) {
        // Obtiene el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        List<FileDB> media = new ArrayList<>();
        if (mediaFiles != null) {
            for (MultipartFile file : mediaFiles) {
                try {
                    String fileName = file.getOriginalFilename();
                    String contentType = file.getContentType();
                    byte[] bytes = file.getBytes();

                    FileDB fileDB = new FileDB(fileName, contentType, bytes);
                    fileDB.setUser(user);
                    Map<?, ?> uploadResult = cloudinary.uploader().upload(bytes,
                            ObjectUtils.asMap(
                                    "resource_type", contentType.startsWith("image/") ? "image" : "video",
                                    "folder", "publications"));
                    fileDB.setUrl((String) uploadResult.get("url"));
                    media.add(fileDB);
                } catch (IOException e) {
                    return ResponseEntity.badRequest().build();
                }
            }
        }

        Publication publication = publicationService.createPublication(content, media, user);
        return ResponseEntity.ok(publication);
    }

}