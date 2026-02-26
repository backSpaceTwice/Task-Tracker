package com.quan.tasks.mappers;

import com.quan.tasks.domain.dto.TaskDto;
import com.quan.tasks.domain.dto.TaskListDto;
import com.quan.tasks.domain.entities.TaskList;

public interface TaskListMapper {

    TaskList fromDto(TaskListDto taskListDto);

    TaskListDto toDto(TaskList taskList);
}
