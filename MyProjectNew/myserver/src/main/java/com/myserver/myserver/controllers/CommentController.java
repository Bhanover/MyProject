package com.myserver.myserver.controllers;

import com.myserver.myserver.exception.ResourceNotFoundException;
import com.myserver.myserver.models.Comment;
import com.myserver.myserver.models.FileDB;
import com.myserver.myserver.models.Publication;
import com.myserver.myserver.models.User;
import com.myserver.myserver.payload.request.CommentRequest;
import com.myserver.myserver.payload.response.CommentResponse;
import com.myserver.myserver.repository.CommentRepository;
import com.myserver.myserver.repository.FileDBRepository;
import com.myserver.myserver.repository.PublicationRepository;
import com.myserver.myserver.repository.UserRepository;
import com.myserver.myserver.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
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
    /*Esta es una URL de imagen predeterminada utilizada como imagen de perfil
     predeterminada para usuarios que no han establecido una imagen de perfil.*/
    final  String defaultImageUrl = "https://res.cloudinary.com/dhqfopwka/image/upload/v1683919422/defaultImage/defaultAvatar_f4vs3m.jpg";
    /*Es un método POST que se utiliza para agregar un comentario a un archivo específico*/
    @PostMapping("/files/{fileId}/comments")
    public ResponseEntity<?> addCommentToFile(@PathVariable("fileId") String fileId, @RequestBody String commentText, Principal principal) {
        return commentService.addCommentToFile(fileId, commentText, principal);
    }
    /*Es un método GET que se utiliza para obtener todos los comentarios para un archivo específico*/
    @GetMapping("/files/{fileId}/comments")
    public ResponseEntity<List<CommentResponse>> getAllCommentsForFile(@PathVariable("fileId") String fileId, Principal principal) {
        return ResponseEntity.ok(commentService.getAllCommentsForFile(fileId, principal));
    }
    /*Es un método PUT que se utiliza para actualizar un comentario específico*/
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable("commentId") Long commentId, @RequestBody String commentText, Principal principal) {
        return commentService.updateComment(commentId, commentText, principal);
    }
    /*Es un método DELETE que se utiliza para eliminar un comentario específico.*/
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable("commentId") Long commentId, Principal principal) {
        return commentService.deleteComment(commentId, principal);
    }

    /*Es un método POST que se utiliza para agregar un comentario a una publicación específica*/
    @PostMapping("/publications/{publicationId}/comments")
    public ResponseEntity<CommentResponse> addCommentToPublication(@PathVariable("publicationId") Long publicationId, @RequestBody CommentRequest commentRequest, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        Publication publication = publicationRepository.findById(publicationId).orElseThrow(() -> new ResourceNotFoundException("Publication", "id", publicationId));

        Comment comment = new Comment(commentRequest.getCommentText(), currentUser, publication);
        comment.setCreationTime(LocalDateTime.now()); // Establecer la fecha de creación
        commentRepository.save(comment);

        CommentResponse commentResponse = new CommentResponse(comment.getId(), comment.getText(), comment.getCreationTime(), currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(commentResponse);
    }
    /*Es un método GET que se utiliza para obtener todos los comentarios para una publicación específica*/
    @GetMapping("/publications/{publicationId}/comments")
    public ResponseEntity<List<CommentResponse>> getAllCommentsForPublication(@PathVariable("publicationId") Long publicationId, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User", "username", principal.getName()));
        Publication publication = publicationRepository.findById(publicationId).orElseThrow(() -> new ResourceNotFoundException("Publication", "id", publicationId));

        List<Comment> comments = commentService.getCommentsByPublication(publication);
        /*obtiene todos los comentarios de la publicación y los mapea a respuestas de
        comentarios que incluyen la URL de la imagen de perfil del autor del comentario*/
        List<CommentResponse> commentResponses = comments.stream().map(comment -> {
            User author = comment.getUser();
            String authorProfileImage = author.getProfileImage() != null ? author.getProfileImage().getUrl() : defaultImageUrl;
            return new CommentResponse(comment.getId(), comment.getText(), comment.getCreationTime(), author.getUsername(), author.getId(), authorProfileImage); // Incluye la URL en la instancia de CommentResponse
        }).collect(Collectors.toList());
        return ResponseEntity.ok(commentResponses);
    }

}
