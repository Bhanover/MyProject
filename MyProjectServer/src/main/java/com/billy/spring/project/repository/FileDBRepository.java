package com.billy.spring.project.repository;

import com.billy.spring.project.models.FileDB;
import com.billy.spring.project.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileDBRepository extends JpaRepository<FileDB, String> {


    List<FileDB> findByUserAndContentTypeStartingWith(User user, String contentType);

}