package com.billy.spring.project.service;

import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.User;
import com.billy.spring.project.repository.FileDBRepository;
import com.billy.spring.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService {
    @Autowired
    private FileDBRepository fileDBRepository;

    @Autowired
    private UserRepository userRepository;
    public List<FileDB> getImagesByUser(User user) {
        return fileDBRepository.findByUserAndContentTypeStartingWith(user, "image/");
    }
}
