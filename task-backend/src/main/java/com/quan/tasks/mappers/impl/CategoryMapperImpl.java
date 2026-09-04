package com.quan.tasks.mappers.impl;

import com.quan.tasks.domain.dto.CategoryDto;
import com.quan.tasks.domain.entities.Category;
import com.quan.tasks.mappers.CategoryMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public Category fromDto(CategoryDto categoryDto) {
        Category category = new Category();
        category.setId(categoryDto.id());
        category.setTitle(categoryDto.title());
        category.setColor(categoryDto.color());
        return category;
    }

    @Override
    public CategoryDto toDto(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getTitle(),
                category.getColor(),
                Optional.ofNullable(category.getTasks())
                        .map(tasks -> (long) tasks.size())
                        .orElse(0L)
        );
    }
}
