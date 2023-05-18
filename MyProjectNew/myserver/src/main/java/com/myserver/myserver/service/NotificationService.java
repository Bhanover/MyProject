package com.myserver.myserver.service;


import com.myserver.myserver.models.Notification;
import com.myserver.myserver.models.User;
import com.myserver.myserver.repository.NotificationRepository;
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
    /*Este método guarda una notificación en la base de datos utilizando el método save()*/
    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    /*Este método marca una notificación como leída. Recibe el ID de la notificación y el usuario como argumentos.*/
    public Notification markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}