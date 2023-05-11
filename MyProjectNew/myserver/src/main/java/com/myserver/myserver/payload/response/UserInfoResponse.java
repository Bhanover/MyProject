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
	private FileDB profileImage;

	public UserInfoResponse(Long id, String username, String email) {
		this.id = id;
		this.username = username;
		this.email = email;
	}
	public UserInfoResponse(User user) {
		this.id = user.getId();
		this.username = user.getUsername();
		this.email = user.getEmail();
		this.profileImage = user.getProfileImage();
	}
}
