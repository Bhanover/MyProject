package com.billy.spring.project.service;

import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;


    public void updateToken(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found with id: " + userId));

        user.setJwtToken(token);
        userRepository.save(user);
    }
}