package com.myserver.myserver.payload.response;

import com.myserver.myserver.models.FileDB;
import com.myserver.myserver.models.User;
import lombok.*;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
	private Long id;
	private String username;
	private String email;
	private String profileImageUrl; // Cambiar de FileDB a String

	public UserInfoResponse(Long id, String username, String email) {
		this.id = id;
		this.username = username;
		this.email = email;
	}

	public UserInfoResponse(User user, String defaultImageUrl) {
		this.id = user.getId();
		this.username = user.getUsername();
		this.email = user.getEmail();

		// Establecer la URL de la imagen de perfil al valor predeterminado
		this.profileImageUrl = defaultImageUrl;

		// Si el usuario tiene una imagen de perfil, establecer la URL de la imagen de perfil al valor correspondiente
		if (user.getProfileImage() != null) {
			this.profileImageUrl = user.getProfileImage().getUrl();
		}
	}
}