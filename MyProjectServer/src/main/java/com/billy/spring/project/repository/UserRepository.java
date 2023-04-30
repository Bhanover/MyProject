package com.billy.spring.project.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.billy.spring.project.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  List<User> findByIdIn(List<Long> ids);

  @Query("SELECT new map(u.id as id, u.username as username, u.email as email, p.url as profileImage) FROM User u LEFT JOIN u.profileImage p WHERE u.id = :userId")
  Optional<Map<String, Object>> findUserInfoById(@Param("userId") Long userId);
  Optional<User> findByUsername(String username);
  Boolean existsByUsername(String username);
  Boolean existsByEmail(String email);
  List<User> findByUsernameContainingIgnoreCase(String query);

  @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
  List<User> searchUsersByUsernameOrEmail(@Param("query") String query);
  List<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String query, String query1);



  @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
  List<User> findByUsernameContaining(@Param("searchTerm") String searchTerm);
  @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
  List<User> searchUsers(@Param("searchTerm") String searchTerm);



  @Query("SELECT new map(" +
          "COALESCE(f.id, p.id) as id, " +
          "f.filename as filename, " +
          "f.contentType as contentType, " +
          "f.url as url, " + // Agrega esta línea
          "f.description as fileDescription, " +
          "COALESCE(f.creationTime, p.creationTime) as creationTime, " +
          "CASE WHEN f.id IS NOT NULL THEN 'file' ELSE 'publication' END as entityType, " +
          "p.content as content) " +
          "FROM User u " +
          "LEFT JOIN u.files f " +
          "LEFT JOIN u.publications p " +
          "WHERE u.id = :id AND (f.contentType LIKE 'image/%' OR f.contentType LIKE 'video/%' OR p.id IS NOT NULL) " +
          "ORDER BY COALESCE(f.creationTime, p.creationTime) DESC")
  List<Map<String, Object>> findUserContent(Long id);





}