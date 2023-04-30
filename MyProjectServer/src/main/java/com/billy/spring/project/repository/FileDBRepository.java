package com.billy.spring.project.repository;

import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FileDBRepository extends JpaRepository<FileDB, String> {

    @Query("SELECT new map(f.id as id, f.filename as name, f.url as url, f.contentType as contentType,f.description as description, f.creationTime as creationTime, 'file' as entityType, f.user.id as userId) " +
            "FROM FileDB f " +
            "WHERE f.user = :user AND (f.contentType LIKE 'image/%' OR f.contentType LIKE 'video/%')")
    List<Map<String, Object>> findImagesAndVideosByUser(User user);

    /*  List<FileDB> findByUserAndContentTypeStartingWith(User user, String contentType);*/
   /* @Query("SELECT f FROM FileDB f JOIN FETCH f.user u WHERE u.id = :userId AND f.contentType LIKE 'image/%'")
    List<FileDB> findImagesByUserIdWithJoinFetch(@Param("userId") Long userId);
    */
    @Query("SELECT new map(f.id as videoId, f.url as url, f.description as description, f.creationTime as creationTime, u.id as userId) FROM FileDB f JOIN f.user u WHERE u.id = :userId AND f.contentType LIKE 'video/%'")
    List<Map<String, Object>> findVideosByUserId(@Param("userId") Long userId);

    @Query("SELECT new map(f.id as imageId, f.url as url, f.description as description, f.creationTime as creationTime, u.id as userId) FROM FileDB f JOIN f.user u WHERE u.id = :userId AND f.contentType LIKE 'image/%'")
    List<Map<String, Object>> findImagesByUserId(@Param("userId") Long userId);

}




