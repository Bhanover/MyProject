package com.billy.spring.project.repository;

import com.billy.spring.project.models.Publication;
import com.billy.spring.project.models.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    @Query("SELECT p FROM Publication p WHERE p.user = :user")
    List<Publication> findByUser(@Param("user") User user);
    @Query("SELECT p FROM Publication p WHERE p.user.id = :userId")
    List<Publication> findByUserId(@Param("userId") Long userId);

    @Query("SELECT new map(p.id as id, p.content as content, p.creationTime as creationTime, 'publication' as entityType, p.user.id as userId) " +
            "FROM Publication p " +
            "WHERE p.user = :user")
    List<Map<String, Object>> findPublicationsByUser(User user);
}