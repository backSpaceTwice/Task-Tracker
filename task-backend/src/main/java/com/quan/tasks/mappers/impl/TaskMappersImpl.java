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

        Task task = new Task();
        task.setId(taskDto.id());
        task.setTitle(taskDto.title());
        task.setDescription(taskDto.description());
        task.setDueDate(taskDto.dueDate());
        task.setStatus(taskDto.status());
        task.setPriority(taskDto.priority());
        task.setCategory(category);
        task.setCreated(taskDto.created());
        task.setUpdated(taskDto.updated());
        return task;
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
