package com.quan.tasks.services.impl;

import com.quan.tasks.domain.entities.Category;
import com.quan.tasks.repositories.CategoryRepository;
import com.quan.tasks.services.CategoryService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> listCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(Category category) {
        if (null != category.getId()) {
            throw new IllegalArgumentException("Category already has an ID!");
        }
        if (null == category.getTitle() || category.getTitle().isBlank()) {
            throw new IllegalArgumentException("Category title must be present!");
        }

        LocalDateTime now = LocalDateTime.now();
        category.setCreated(now);
        category.setUpdated(now);
        return categoryRepository.save(category);
    }

    @Override
    public Optional<Category> getCategory(UUID id) {
        return categoryRepository.findById(id);
    }

    @Transactional
    @Override
    public Category updateCategory(UUID id, Category category) {
        if (null == category.getId()) {
            throw new IllegalArgumentException("Category must have an ID!");
        }
        if (!Objects.equals(category.getId(), id)) {
            throw new IllegalArgumentException("Attempting to change category ID, this is not permitted!");
        }

        Category existingCategory = categoryRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Category not found"));

        existingCategory.setTitle(category.getTitle());
        existingCategory.setColor(category.getColor());
        existingCategory.setUpdated(LocalDateTime.now());
        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
    }
}
