package com.quan.tasks.mappers;

import com.quan.tasks.domain.dto.TaskDto;
import com.quan.tasks.domain.entities.Task;

public interface TaskMapper {

    Task fromDto(TaskDto taskDto);

    TaskDto toDto(Task task);
}
