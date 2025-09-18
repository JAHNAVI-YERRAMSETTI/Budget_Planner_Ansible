package com.bps.service;

import com.bps.model.Category;
import java.util.List;

public interface CategoryService {
    String addCategory(Category category);
    List<Category> getCategoriesByUser(int userid);
    String updateCategory(Category category);
    String deleteCategory(int categoryId);
}
