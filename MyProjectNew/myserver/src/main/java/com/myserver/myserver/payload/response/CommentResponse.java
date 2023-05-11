package com.myserver.myserver.payload.response;

import lombok.*;

import java.time.LocalDateTime;
@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private String text;
    private LocalDateTime createdAt;
    private String authorUsername;
    private Long authorId;

    private String authorProfileImage;


    public CommentResponse(Long id, String text, LocalDateTime createdAt, String authorUsername, Long authorId) {
        this.id = id;
        this.text = text;
        this.createdAt = createdAt;
        this.authorUsername = authorUsername;
        this.authorId = authorId;
    }
}
