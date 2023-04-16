package com.billy.spring.project.service;

import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }


    public List<User> searchsUsers(String searchTerm) {
        System.out.println("esto"+searchTerm);
        // Aquí es donde realizas la búsqueda en la base de datos utilizando el repositorio de usuarios.
        // El siguiente ejemplo supone que tu repositorio de usuarios tiene un método llamado `findByNameContaining`:
        return userRepository.findByUsernameContaining(searchTerm);
    }

}