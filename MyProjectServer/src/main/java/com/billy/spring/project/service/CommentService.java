package com.billy.spring.project.service;

import com.billy.spring.project.models.Comment;
import com.billy.spring.project.models.Publication;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    public List<Comment> getCommentsByPublication(Publication publication) {
        return publication.getComments();
    }
}
