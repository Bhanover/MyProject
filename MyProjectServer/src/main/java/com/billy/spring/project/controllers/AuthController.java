package com.billy.spring.project.controllers;

import javax.validation.Valid;

import com.billy.spring.project.service.UserServiceImpl;
import com.billy.spring.project.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.billy.spring.project.payload.request.LoginRequest;
import com.billy.spring.project.payload.request.SignupRequest;
import com.billy.spring.project.payload.response.UserInfoResponse;
import com.billy.spring.project.payload.response.MessageResponse;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.jwt.JwtUtils;
import com.billy.spring.project.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)


@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;


  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;
  @Autowired
  UserServiceImpl userServiceImpl;
  @Autowired
  JwtUtils jwtUtils;
  @Autowired
  private UserServiceImpl userService;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    String jwtToken = jwtUtils.generateTokenFromUsername(userDetails.getUsername());

    userService.updateToken(userDetails.getId(), jwtToken);
    System.out.println(jwtToken);
    // Return JWT token in response
    return ResponseEntity.ok()
            .body(new UserInfoResponse(userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), jwtToken));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account

    User user = new User(signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword()));
    userRepository.save(user);

    // Generate JWT token for the new user
    String jwtToken = jwtUtils.generateTokenFromUsername(signUpRequest.getUsername());

    return ResponseEntity.ok(new UserInfoResponse(user.getId(), user.getUsername(), user.getEmail(), jwtToken));
  }

  @PostMapping("/signout")
  public ResponseEntity<?> logoutUser() {
    // There's nothing to delete on the client side when using tokens
    return ResponseEntity.ok().body(new MessageResponse("You've been signed out!"));
  }
}

