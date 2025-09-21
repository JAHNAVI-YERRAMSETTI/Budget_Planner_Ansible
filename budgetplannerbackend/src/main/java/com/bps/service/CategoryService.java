package com.bps.service;

import com.bps.model.Category;
import java.util.List;

public interface CategoryService {
    Category saveCategory(Category category);
    Category findById(Long id);
    List<Category> findAll();
    List<Category> findByUserId(Long userId);
    void deleteById(Long id);
}