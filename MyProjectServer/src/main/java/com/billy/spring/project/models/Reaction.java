package com.billy.spring.project.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reactions")
public class Reaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "publication_id", referencedColumnName = "id")
    @JsonIgnore
    private Publication publication;

    @ManyToOne
    @JoinColumn(name = "file_id", referencedColumnName = "id")
    @JsonIgnore
    private FileDB file;

    @Enumerated(EnumType.STRING)
    private ReactionType type;


    // Getters and setters
}
