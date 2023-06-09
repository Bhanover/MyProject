package com.myserver.myserver.models;


import com.fasterxml.jackson.annotation.*;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;


    @Size(max = 50)
    private String firstName;


    @Size(max = 50)
    private String lastName;


    @Past
    @Temporal(TemporalType.DATE)
    private Date birthDate;

    @Size(max = 50)
    private String gender;

    @Size(max = 100)
    private String currentLocation;

    @Size(max = 100)
    private String workplace;

    @Size(max = 100)
    private String education;

    @Size(max = 50)
    private String maritalStatus;

    @Size(max = 500)
    private String interests;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_image_id", referencedColumnName = "id")
    @JsonIgnore
    private FileDB profileImage;

    private String jwtToken;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<FileDB> files;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Publication> publications;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Friendship> friendships;

    @OneToMany(mappedBy = "friend", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Friendship> friends;

    private boolean isOnline;

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
