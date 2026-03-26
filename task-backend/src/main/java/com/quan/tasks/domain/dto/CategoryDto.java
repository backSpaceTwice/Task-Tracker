package com.quan.tasks.domain.dto;

import java.util.UUID;

public record CategoryDto(
        UUID id,
        String title,
        String color,
        Long taskCount
) {
}
