package com.billy.spring.project.service;


import com.billy.spring.project.repository.FileDBRepository;
import com.billy.spring.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageService {
    @Autowired
    private FileDBRepository fileDBRepository;

    @Autowired
    private UserRepository userRepository;
   /* public List<FileDB> getImagesByUser(User user) {
        return fileDBRepository.findByUserAndContentTypeStartingWith(user, "image/");
    }*/
   /* public List<ImageInfo> getImagesByUser(User user) {
        List<FileDB> images = fileDBRepository.findByUserAndContentTypeStartingWith(user, "image/");
        return images.stream().map(image -> new ImageInfo(
                image.getUrl(),
                image.getId(),
                image.getDescription(),
                image.getCreationTime().toString()
        )).collect(Collectors.toList());
    }*/




}
