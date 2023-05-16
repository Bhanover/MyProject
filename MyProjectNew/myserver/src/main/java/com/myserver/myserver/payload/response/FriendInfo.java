package com.myserver.myserver.payload.response;

import com.myserver.myserver.models.FileDB;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FriendInfo {
    private Long id;
    private String url;
    private String username;

    private boolean pending;
    private Long friendshipId;
    private Long requesterId;


}