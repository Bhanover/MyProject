package com.myserver.myserver.controllers;

import com.myserver.myserver.models.User;
import com.myserver.myserver.payload.request.LoginRequest;
import com.myserver.myserver.payload.request.SignupRequest;
import com.myserver.myserver.payload.response.JwtResponse;
import com.myserver.myserver.payload.response.MessageResponse;
import com.myserver.myserver.payload.response.UserInfoResponse;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.jwt.JwtUtils;
import com.myserver.myserver.security.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JwtUtils jwtUtils;

    /* Este método maneja las solicitudes de registro de usuarios.*/
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(new UserInfoResponse(user.getId(), user.getUsername(), user.getEmail()));
    }
    /* Este método maneja las solicitudes de inicio de sesión de los usuarios
     Toma una LoginRequest con el nombre de usuario y la contraseña.
    Intenta autenticar al usuario utilizando el AuthenticationManager.*/
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        /*Se utiliza AuthenticationManager para autenticar al
        usuario utilizando las credenciales proporcionadas en loginRequest.*/
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        /*Se genera un token para el usuario*/
        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails.getUsername());
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));
        user.setJwtToken(jwtToken);
        /*Esto se usa para establecer que el usuario esta online*/
        user.setOnline(true);

        userRepository.save(user);
        /*Se devuelve una respuesta HTTP exitosa (ResponseEntity.ok(...))
        con un objeto JwtResponse en el cuerpo. JwtResponse*/
        return ResponseEntity.ok(new JwtResponse(jwtToken, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail()));
    }

    /*Este método maneja las solicitudes de cierre de sesión de los usuarios.*/
    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getId();
            // Obtiene el objeto User de la base de datos
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User Not Found with id: " + userId));
            // Elimina el token JWT del registro del usuario en la base de datos
            user.setJwtToken(null);
            user.setOnline(false); // Establecer el estado fuera de línea aquí
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("Log out successful!"));
        } else {
            throw new RuntimeException("No se pudo obtener el usuario autenticado");
        }
    }

}
