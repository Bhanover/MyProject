package com.billy.spring.project.service;

import com.billy.spring.project.models.Notification;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> findByUser(User user) {
        return notificationRepository.findByUser(user);
    }

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }
    public Notification createNotification(User user, String type, String content) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setContent(content);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}