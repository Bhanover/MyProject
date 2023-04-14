package com.billy.spring.project.repository;

import java.util.List;
import java.util.Optional;

import com.billy.spring.project.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);
  Boolean existsByUsername(String username);
  Boolean existsByEmail(String email);
  @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
  List<User> searchUsersByUsernameOrEmail(@Param("query") String query);
  List<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String query, String query1);
}