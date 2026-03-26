package com.quan.tasks.services;

import com.quan.tasks.domain.entities.Category;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryService {
    List<Category> listCategories();
    Category createCategory(Category category);
    Optional<Category> getCategory(UUID id);
    Category updateCategory(UUID id, Category category);
    void deleteCategory(UUID id);
}
