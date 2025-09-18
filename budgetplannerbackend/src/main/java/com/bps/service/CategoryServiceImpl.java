package com.bps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bps.model.Category;
import com.bps.repository.CategoryRepository;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public String addCategory(Category category) {
        categoryRepository.save(category);
        return "Category added successfully";
    }

    @Override
    public List<Category> getCategoriesByUser(int userid) {
        return categoryRepository.findByUserid(userid);
    }

    @Override
    public String updateCategory(Category category) {
        categoryRepository.save(category);
        return "Category updated successfully";
    }

    @Override
    public String deleteCategory(int categoryId) {
        categoryRepository.deleteById(categoryId);
        return "Category deleted successfully";
    }
}
