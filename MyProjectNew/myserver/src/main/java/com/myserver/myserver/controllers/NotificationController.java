package com.myserver.myserver.controllers;



import com.myserver.myserver.models.Notification;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.security.service.UserDetailsImpl;
import com.myserver.myserver.service.NotificationService;
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
    private UserRepository userRepository;
    /* Este método obtiene las notificaciones del usuario actualmente autenticado*/
    @GetMapping("/notification")
    public ResponseEntity<List<Notification>> getNotificationsByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));
        List<Notification> notifications = notificationService.findByUser(user);
        return ResponseEntity.ok(notifications);
    }
    /*. Este método marca una notificación específica como leída para el usuario autenticado*/
    @PutMapping("/read/{notificationId}")
    public ResponseEntity<Notification> markNotificationAsRead(@PathVariable Long notificationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Not Found"));

        Notification notification = notificationService.markAsRead(notificationId, user);
        return ResponseEntity.ok(notification);
    }
}