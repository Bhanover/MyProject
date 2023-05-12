package com.myserver.myserver.service;

import com.myserver.myserver.exception.ResourceNotFoundException;
import com.myserver.myserver.exception.UnauthorizedException;
import com.myserver.myserver.models.Comment;
import com.myserver.myserver.models.FileDB;
import com.myserver.myserver.models.Publication;
import com.myserver.myserver.models.User;
import com.myserver.myserver.payload.response.CommentResponse;
import com.myserver.myserver.repository.CommentRepository;
import com.myserver.myserver.repository.FileDBRepository;
import com.myserver.myserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileDBRepository fileDBRepository;

    @Autowired
    private CommentRepository commentRepository;
    final  String defaultImageUrl = "https://res.cloudinary.com/dhqfopwka/image/upload/v1683919422/defaultImage/defaultAvatar_f4vs3m.jpg";

    public ResponseEntity<?> addCommentToFile(String fileId, String commentText, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        FileDB file = fileDBRepository.findById(fileId).orElseThrow(() -> new ResourceNotFoundException("File", "id", fileId));

        Comment comment = new Comment(commentText, file, currentUser);
        comment.setCreationTime(LocalDateTime.now()); // Establecer la fecha de creación
        commentRepository.save(comment);

        return ResponseEntity.ok().build();
    }


    public List<CommentResponse> getAllCommentsForFile(String fileId, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        FileDB file = fileDBRepository.findById(fileId).orElseThrow(() -> new ResourceNotFoundException("File", "id", fileId));

        List<Comment> comments = file.getComments();

        // Convierte la lista de comentarios a una lista de CommentResponse
        List<CommentResponse> commentResponses = comments.stream().map(comment -> {
            User author = comment.getUser();
            String authorProfileImage = author.getProfileImage() != null ? author.getProfileImage().getUrl() : defaultImageUrl;
            return new CommentResponse(comment.getId(), comment.getText(), comment.getCreationTime(), author.getUsername(), author.getId(), authorProfileImage); // Incluya la URL en la instancia de CommentResponse
        }).collect(Collectors.toList());
        return commentResponses;
    }

    public ResponseEntity<?> updateComment(Long commentId, String commentText, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        // Verificar si el usuario actual es el autor del comentario
        if (!comment.getUser().equals(currentUser)) {
            throw new UnauthorizedException("No tienes permiso para actualizar este comentario.");
        }

        comment.setText(commentText);
        commentRepository.save(comment);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> deleteComment(Long commentId, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        // Verificar si el usuario actual es el autor del comentario
        if (!comment.getUser().equals(currentUser)) {
            throw new UnauthorizedException("No tienes permiso para eliminar este comentario.");
        }

        commentRepository.delete(comment);

        return ResponseEntity.ok().build();
    }
    public List<Comment> getCommentsByPublication(Publication publication) {
        return publication.getComments();
    }

}
