package com.billy.spring.project.controllers;

import com.billy.spring.project.exeption.ResourceNotFoundException;
import com.billy.spring.project.exeption.UnauthorizedException;
import com.billy.spring.project.models.Comment;
import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.Publication;
import com.billy.spring.project.models.User;
import com.billy.spring.project.payload.response.CommentResponse;
import com.billy.spring.project.repository.CommentRepository;
import com.billy.spring.project.repository.FileDBRepository;
import com.billy.spring.project.repository.PublicationRepository;
import com.billy.spring.project.repository.UserRepository;
import com.billy.spring.project.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class CommentController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileDBRepository fileDBRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private CommentService commentService;
    @Autowired
    private PublicationRepository publicationRepository;
    @PostMapping("/files/{fileId}/comments")
    public ResponseEntity<?> addCommentToFile(@PathVariable("fileId") String fileId, @RequestBody String commentText, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        FileDB file = fileDBRepository.findById(fileId).orElseThrow(() -> new ResourceNotFoundException("File", "id", fileId));

        Comment comment = new Comment(commentText, file, currentUser);
        commentRepository.save(comment);

        return ResponseEntity.ok().build();
    }
    @GetMapping("/files/{fileId}/comments")
    public ResponseEntity<List<CommentResponse>> getAllCommentsForFile(@PathVariable("fileId") String fileId,Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        FileDB file = fileDBRepository.findById(fileId).orElseThrow(() -> new ResourceNotFoundException("File", "id", fileId));

        List<Comment> comments = file.getComments();

        // Convierte la lista de comentarios a una lista de CommentResponse
        List<CommentResponse> commentResponses = comments.stream().map(comment -> {
            User author = comment.getUser();
            return new CommentResponse(comment.getId(), comment.getText(), comment.getCreationTime(), author.getUsername(), author.getId());
        }).collect(Collectors.toList());
        return ResponseEntity.ok(commentResponses);
    }
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable("commentId") Long commentId, @RequestBody String commentText, Principal principal) {
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
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable("commentId") Long commentId, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        // Verificar si el usuario actual es el autor del comentario
        if (!comment.getUser().equals(currentUser)) {
            throw new UnauthorizedException("No tienes permiso para eliminar este comentario.");
        }

        commentRepository.delete(comment);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/publications/{publicationId}/comments")
    public ResponseEntity<?> addCommentToPublication(@PathVariable("publicationId") Long publicationId, @RequestBody String commentText, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        Publication publication = publicationRepository.findById(publicationId).orElseThrow(() -> new ResourceNotFoundException("Publication", "id", publicationId));

        Comment comment = new Comment(commentText, publication, currentUser);
        commentRepository.save(comment);

        return ResponseEntity.ok().build();
    }

   /* @GetMapping("/publications/{publicationId}/comments")
    public ResponseEntity<List<CommentResponse>> getAllCommentsForPublication(@PathVariable("publicationId") Long publicationId, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        Publication publication = publicationRepository.findById(publicationId).orElseThrow(() -> new ResourceNotFoundException("Publication", "id", publicationId));

        List<Comment> comments = publication.getComments();

        List<CommentResponse> commentResponses = comments.stream().map(comment -> {
            User author = comment.getUser();
            return new CommentResponse(comment.getId(), comment.getText(), comment.getCreationTime(), author.getUsername(), author.getId());
        }).collect(Collectors.toList());
        return ResponseEntity.ok(commentResponses);
    }*/

    @GetMapping("/publications/{publicationId}/comments")
    public ResponseEntity<List<CommentResponse>> getAllCommentsForPublication(@PathVariable("publicationId") Long publicationId, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        Publication publication = publicationRepository.findById(publicationId).orElseThrow(() -> new ResourceNotFoundException("Publication", "id", publicationId));

        List<Comment> comments = commentService.getCommentsByPublication(publication);

        List<CommentResponse> commentResponses = comments.stream().map(comment -> {
            User author = comment.getUser();
            return new CommentResponse(comment.getId(), comment.getText(), comment.getCreationTime(), author.getUsername(), author.getId());
        }).collect(Collectors.toList());
        return ResponseEntity.ok(commentResponses);
    }
}
