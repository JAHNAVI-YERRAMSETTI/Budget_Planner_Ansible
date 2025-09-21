package com.bps.repository;

import com.bps.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    
    @Query("SELECT c FROM Category c ORDER BY c.name")
    List<Category> findAllOrderByName();
}