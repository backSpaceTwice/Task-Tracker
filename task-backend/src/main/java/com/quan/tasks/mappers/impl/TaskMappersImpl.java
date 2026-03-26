package com.quan.tasks.mappers.impl;

import com.quan.tasks.domain.dto.TaskDto;
import com.quan.tasks.domain.entities.Category;
import com.quan.tasks.domain.entities.Task;
import com.quan.tasks.mappers.TaskMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class TaskMappersImpl implements TaskMapper {
    @Override
    public Task fromDto(TaskDto taskDto) {
        Category category = null;
        if (taskDto.categoryId() != null) {
            category = new Category();
            category.setId(taskDto.categoryId());
        }

        return new Task(
                taskDto.id(),
                taskDto.title(),
                taskDto.description(),
                taskDto.dueDate(),
                taskDto.status(),
                taskDto.priority(),
                null,
                category,
                taskDto.created(),
                taskDto.updated()
        );
    }

    @Override
    public TaskDto toDto(Task task) {
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus(),
                Optional.ofNullable(task.getCategory()).map(Category::getId).orElse(null),
                task.getCreated(),
                task.getUpdated()
        );
    }
}
