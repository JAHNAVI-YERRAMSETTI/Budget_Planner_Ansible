package com.bps.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bps.model.Category;
import com.bps.service.CategoryService;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/add")
    public ResponseEntity<String> addCategory(@RequestBody Category category) {
        String result = categoryService.addCategory(category);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userid}")
    public ResponseEntity<List<Category>> getCategoriesByUser(@PathVariable int userid) {
        List<Category> categories = categoryService.getCategoriesByUser(userid);
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateCategory(@RequestBody Category category) {
        String result = categoryService.updateCategory(category);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable int categoryId) {
        String result = categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(result);
    }
}
