package com.myserver.myserver.controllers;

import com.myserver.myserver.models.FileDB;
import com.myserver.myserver.models.User;
import com.myserver.myserver.payload.response.UserInfoDetailsResponse;
import com.myserver.myserver.payload.response.UserInfoResponse;
import com.myserver.myserver.repository.FileDBRepository;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileDBRepository fileDBRepository;
    final  String defaultImageUrl = "https://res.cloudinary.com/dhqfopwka/image/upload/v1683919422/defaultImage/defaultAvatar_f4vs3m.jpg";

    /* getUserInfo se utiliza para obtener la información de un usuario en particular.*/

    /*Toma dos parámetros: id que representa el ID del usuario y userDetails que contiene los detalles de autenticación del usuario.
*/
    @GetMapping("/user/{id}/info")
    public ResponseEntity<?> getUserInfo(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
           /* se busca el usuario en la base de datos utilizando el repositorio UserRepository*/
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

            // Pasa la URL de la imagen predeterminada al constructor de UserInfoResponse
            UserInfoResponse userInfoResponse = new UserInfoResponse(user, defaultImageUrl);

            return ResponseEntity.ok(userInfoResponse);
        } catch (Exception e) {
           /* se devuelve una respuesta de error 500 si ocurre alguna excepción.*/
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/user/{id}/infoDetails")
    public ResponseEntity<?> getUserInfoDetails(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            /* se busca el usuario en la base de datos utilizando el repositorio UserRepository*/
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

            UserInfoDetailsResponse userInfoDetailsResponse = new UserInfoDetailsResponse(user);

            return ResponseEntity.ok(userInfoDetailsResponse);
        } catch (Exception e) {
            /* se devuelve una respuesta de error 500 si ocurre alguna excepción.*/
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /* se utiliza para establecer la imagen de perfil de un usuario.*/

    /*Toma un parámetro imageId que representa el ID de la imagen que se utilizará como foto de perfil.*/
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



    @PutMapping("/user/infoDetails")
    public ResponseEntity<?> updateUserInfoDetails(@RequestBody UserInfoDetailsResponse newDetails) {
        try {
            /* Obtener el usuario autenticado */
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
                throw new AccessDeniedException("Acceso denegado. Debe estar autenticado para acceder a este recurso.");
            }
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

            /* Actualizar los campos del usuario con los nuevos detalles */
            user.setUsername(newDetails.getUsername());
            user.setEmail(newDetails.getEmail());
            user.setFirstName(newDetails.getFirstName());
            user.setLastName(newDetails.getLastName());
            user.setBirthDate(newDetails.getBirthDate());
            user.setGender(newDetails.getGender());
            user.setCurrentLocation(newDetails.getCurrentLocation());
            user.setWorkplace(newDetails.getWorkplace());
            user.setEducation(newDetails.getEducation());
            user.setMaritalStatus(newDetails.getMaritalStatus());
            user.setInterests(newDetails.getInterests());

            /* Guardar el usuario actualizado en la base de datos */
            userRepository.save(user);

            return ResponseEntity.ok().build();
        } catch (AccessDeniedException ade) {
            /* se devuelve una respuesta de error 403 si el usuario no está autenticado */
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ade.getMessage());
        } catch (Exception e) {
            /* se devuelve una respuesta de error 500 si ocurre alguna otra excepción */
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
