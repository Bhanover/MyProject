package com.myserver.myserver.repository;

import com.myserver.myserver.models.FileDB;
import com.myserver.myserver.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FileDBRepository extends JpaRepository<FileDB, String> {
    @Query("SELECT new map(f.id as imageId, f.url as url, f.description as description, f.creationTime as creationTime, u.id as userId, u.username as username, COALESCE(p.url, :defaultImageUrl) as profileImage) FROM FileDB f JOIN f.user u LEFT JOIN u.profileImage p WHERE u.id = :userId AND f.contentType LIKE 'image/%'")
    List<Map<String, Object>> findImagesByUserId(@Param("userId") Long userId, @Param("defaultImageUrl") String defaultImageUrl);
    @Query("SELECT new map(f.id as videoId, f.url as url, f.description as description, f.creationTime as creationTime, u.id as userId, u.username as username, COALESCE(p.url, :defaultImageUrl) as profileImage) FROM FileDB f JOIN f.user u LEFT JOIN u.profileImage p WHERE u.id = :userId AND f.contentType LIKE 'video/%'")
    List<Map<String, Object>> findVideosByUserId(@Param("userId") Long userId, @Param("defaultImageUrl") String defaultImageUrl);

    @Query("SELECT new map(f.id as id, f.filename as name, f.url as url, f.contentType as contentType, f.description as description, f.creationTime as creationTime, 'file' as entityType, u.id as userId, u.username as username, COALESCE(p.url, :defaultImageUrl) as profileImage) " +
            "FROM FileDB f JOIN f.user u LEFT JOIN u.profileImage p " +
            "WHERE f.user = :user AND (f.contentType LIKE 'image/%' OR f.contentType LIKE 'video/%')")
    List<Map<String, Object>> findImagesAndVideosByUser(User user, @Param("defaultImageUrl") String defaultImageUrl);
}
