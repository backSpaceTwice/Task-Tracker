import React from 'react';
import TaskItemCompact from './TaskItemCompact';
import TaskItemDetailed from './TaskItemDetailed';

// Thin dispatcher: the compact (dashboard) and detailed (list view) rows are
// different enough in layout that forcing them into one component meant
// branching on `compact` at every field. Two focused components read easier
// than one with two interleaved layouts.
const TaskItem = ({ task, listId, onUpdate, onPatchTask, onDelete, categories = [], compact = false }) =>
  compact
    ? <TaskItemCompact task={task} listId={listId} onUpdate={onUpdate} onPatchTask={onPatchTask} onDelete={onDelete} categories={categories} />
    : <TaskItemDetailed task={task} listId={listId} onUpdate={onUpdate} onPatchTask={onPatchTask} onDelete={onDelete} categories={categories} />;

export default TaskItem;
