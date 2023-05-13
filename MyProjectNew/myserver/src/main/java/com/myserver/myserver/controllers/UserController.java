package com.myserver.myserver.controllers;

import com.myserver.myserver.models.FileDB;
import com.myserver.myserver.models.User;
import com.myserver.myserver.payload.response.UserInfoResponse;
import com.myserver.myserver.repository.FileDBRepository;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileDBRepository fileDBRepository;
    final  String defaultImageUrl = "https://res.cloudinary.com/dhqfopwka/image/upload/v1683919422/defaultImage/defaultAvatar_f4vs3m.jpg";

    @GetMapping("/user/{id}/info")
    public ResponseEntity<?> getUserInfo(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

            // Pasar la URL de la imagen predeterminada al constructor de UserInfoResponse
            UserInfoResponse userInfoResponse = new UserInfoResponse(user, defaultImageUrl);

            return ResponseEntity.ok(userInfoResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/set-profile-image")
    public ResponseEntity<String> setProfileImage(@RequestParam("imageId") String imageId) {
        try {
            // Obtiene el usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

            // Encuentra la imagen en la base de datos
            FileDB image = fileDBRepository.findById(imageId).orElseThrow(() -> new RuntimeException("Image Not Found"));

            // Verifica si la imagen pertenece al usuario
            if (!image.getUser().equals(user)) {
                return ResponseEntity.badRequest().body("No tienes permiso para utilizar esta imagen como foto de perfil.");
            }

            // Actualiza la foto de perfil del usuario
            user.setProfileImage(image);
            userRepository.save(user);

            return ResponseEntity.ok("Foto de perfil actualizada.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
