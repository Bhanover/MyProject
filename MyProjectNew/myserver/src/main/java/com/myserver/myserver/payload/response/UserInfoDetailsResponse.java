package com.myserver.myserver.payload.response;

import com.myserver.myserver.models.User;
import lombok.*;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;
import java.util.Date;

import lombok.*;
import javax.validation.constraints.*;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDetailsResponse {
    private Long id;
    private String username;
    private String email;
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

    public UserInfoDetailsResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.birthDate = user.getBirthDate();
        this.gender = user.getGender();
        this.currentLocation = user.getCurrentLocation();
        this.workplace = user.getWorkplace();
        this.education = user.getEducation();
        this.maritalStatus = user.getMaritalStatus();
        this.interests = user.getInterests();
    }
}
