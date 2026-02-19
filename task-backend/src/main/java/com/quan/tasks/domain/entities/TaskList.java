package com.quan.tasks.domain.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "task_list")
public class TaskList {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "title", nullable = false)
    private String title;

    @OneToMany(mappedBy = "taskList", cascade = {CascadeType.REMOVE, CascadeType.PERSIST})
    private List<Task> tasks;

    @Column(name = "description")
    private String description;

    @Column(name = "created")
    private LocalDateTime created;

    @Column(name = "updated", nullable = false)
    private LocalDateTime updated;
}
