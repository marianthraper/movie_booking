package com.example.demo.repository;

import com.example.demo.model.FoodCombo;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FoodComboRepository extends JpaRepository<FoodCombo, Long> {
    
    // Custom method to fetch all combos with their items
    @EntityGraph(attributePaths = "items")
    @Query("SELECT DISTINCT c FROM FoodCombo c LEFT JOIN FETCH c.items")
    List<FoodCombo> findAllWithItems();
    
    // Custom method to fetch a single combo with its items
    @EntityGraph(attributePaths = "items")
    @Query("SELECT c FROM FoodCombo c LEFT JOIN FETCH c.items WHERE c.id = :id")
    Optional<FoodCombo> findByIdWithItems(@Param("id") Long id);
}