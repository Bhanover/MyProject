package com.billy.spring.project.repository;

import com.billy.spring.project.models.Publication;
import com.billy.spring.project.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    @Query("SELECT p FROM Publication p WHERE p.user = :user")
    List<Publication> findByUser(@Param("user") User user);

}