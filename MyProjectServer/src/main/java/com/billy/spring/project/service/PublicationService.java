package com.billy.spring.project.service;

import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.Publication;
import com.billy.spring.project.models.User;

import java.util.List;

public interface PublicationService {
    Publication createPublication(String content, List<FileDB> media, User user);

}
