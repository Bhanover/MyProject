package com.billy.spring.project.controllers;


import com.billy.spring.project.models.Notification;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.security.services.UserDetailsImpl;
import com.billy.spring.project.service.NotificationService;
import com.billy.spring.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/notification")
    public ResponseEntity<List<Notification>> getNotificationsByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));
        List<Notification> notifications = notificationService.findByUser(user);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/read/{notificationId}")
    public ResponseEntity<Notification> markNotificationAsRead(@PathVariable Long notificationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        Notification notification = notificationService.markAsRead(notificationId, user);
        return ResponseEntity.ok(notification);
    }
}