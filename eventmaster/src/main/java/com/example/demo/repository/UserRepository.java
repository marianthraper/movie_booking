package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;  // Add this import

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}