package com.myserver.myserver.payload.response;

import lombok.*;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String jwtToken;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;

    public JwtResponse(String jwtToken, Long id, String username, String email) {
        this.jwtToken = jwtToken;
        this.id = id;
        this.username = username;
        this.email = email;
    }
}
