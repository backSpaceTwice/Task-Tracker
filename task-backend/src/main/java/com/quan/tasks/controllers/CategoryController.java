package com.quan.tasks.controllers;

import com.quan.tasks.domain.dto.CategoryDto;
import com.quan.tasks.domain.entities.Category;
import com.quan.tasks.mappers.CategoryMapper;
import com.quan.tasks.services.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path = "/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    public CategoryController(CategoryService categoryService, CategoryMapper categoryMapper) {
        this.categoryService = categoryService;
        this.categoryMapper = categoryMapper;
    }

    @GetMapping
    public List<CategoryDto> listCategories() {
        return categoryService.listCategories()
                .stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    @PostMapping
    public CategoryDto createCategory(@RequestBody CategoryDto categoryDto) {
        Category createdCategory = categoryService.createCategory(
                categoryMapper.fromDto(categoryDto)
        );
        return categoryMapper.toDto(createdCategory);
    }

    @GetMapping(path = "/{id}")
    public Optional<CategoryDto> getCategory(@PathVariable("id") UUID id) {
        return categoryService.getCategory(id)
                .map(categoryMapper::toDto);
    }

    @PutMapping(path = "/{id}")
    public CategoryDto updateCategory(
            @PathVariable("id") UUID id,
            @RequestBody CategoryDto categoryDto
    ) {
        Category updatedCategory = categoryService.updateCategory(
                id,
                categoryMapper.fromDto(categoryDto)
        );

        return categoryMapper.toDto(updatedCategory);
    }

    @DeleteMapping(path = "/{id}")
    public void deleteCategory(@PathVariable("id") UUID id) {
        categoryService.deleteCategory(id);
    }
}
