package com.quan.tasks.mappers.impl;

import com.quan.tasks.domain.dto.TaskDto;
import com.quan.tasks.domain.entities.Task;
import com.quan.tasks.mappers.TaskMapper;
import org.springframework.stereotype.Component;

@Component
public class TaskMappersImpl implements TaskMapper {
    @Override
    public Task fromDto(TaskDto taskDto) {
        return new Task(
                taskDto.id(),
                taskDto.title(),
                taskDto.description(),
                taskDto.dueDate(),
                taskDto.status(),
                taskDto.priority(),
                null,
                null,
                null
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
                task.getStatus()
        );
    }
}
