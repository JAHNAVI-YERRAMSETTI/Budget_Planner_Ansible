package com.bps.controller;

import com.bps.model.Category;
import com.bps.service.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;


@CrossOrigin("*")
@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<Category> saveCategory(@RequestBody Category category) {
        Category saved = categoryService.saveCategory(category);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategory(@PathVariable Long id) {
        Category category = categoryService.findById(id);
        return category != null ? ResponseEntity.ok(category) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Category>> getCategoriesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(categoryService.findByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        Category updated = categoryService.saveCategory(category);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteById(id);
            Map<String, String> body = new HashMap<>();
            body.put("status", "success");
            body.put("message", "Category deleted successfully");
            return ResponseEntity.ok(body);
        } catch (DataIntegrityViolationException dive) {
            Map<String, String> body = new HashMap<>();
            body.put("status", "error");
            body.put("message", "Cannot delete this category because it is associated with existing expenses, transactions, or budget goals.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        } catch (Exception ex) {
            Map<String, String> body = new HashMap<>();
            body.put("status", "error");
            body.put("message", "Failed to delete category. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }
}