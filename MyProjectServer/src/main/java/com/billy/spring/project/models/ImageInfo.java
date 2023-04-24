package com.billy.spring.project.models;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageInfo {
    private String url;
    private String imageId;
    private String description;
    private String creationTime;

    // Agrega los constructores, getters y setters necesarios
}

