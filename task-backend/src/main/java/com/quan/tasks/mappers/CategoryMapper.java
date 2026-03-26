package com.quan.tasks.mappers;

import com.quan.tasks.domain.dto.CategoryDto;
import com.quan.tasks.domain.entities.Category;

public interface CategoryMapper {
    Category fromDto(CategoryDto categoryDto);
    CategoryDto toDto(Category category);
}
