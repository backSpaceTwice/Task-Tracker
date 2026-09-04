import React from 'react';
import CategoryBadge from '../common/CategoryBadge';
import { useTaskEditForm } from '../../hooks/useTaskEditForm';

const TaskItemCompact = ({ task, listId, onUpdate, onPatchTask, onDelete, categories = [] }) => {
  const {
    isEditing,
    editTitle,
    setEditTitle,
    editStatus,
    setEditStatus,
    isUpdating,
    startEdit,
    cancelEdit,
    toggleStatus,
    submitEdit,
  } = useTaskEditForm(task, listId, onUpdate, onPatchTask);

  const category = categories.find(c => c.id === task.categoryId);

  if (isEditing) {
    return (
      <li className={`task-item status-${task.status.toLowerCase()} editing`} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={submitEdit} className="task-edit-form">
          <div className="form-group">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-row small">
            <div className="form-group">
              <label>Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div className="edit-actions">
              <button type="submit" className="save-btn" disabled={isUpdating}>✓</button>
              <button type="button" className="cancel-btn" onClick={cancelEdit}>✕</button>
            </div>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`task-item status-${task.status.toLowerCase()} clickable`}
      onClick={startEdit}
    >
      <div className="task-checkbox-container" onClick={toggleStatus}>
        <div className={`task-checkbox ${task.status === 'CLOSED' ? 'checked' : ''}`}>
          {task.status === 'CLOSED' && '✓'}
        </div>
      </div>
      <div className="task-info">
        <div className="task-title-row">
          <span className="task-title">{task.title}</span>
          <CategoryBadge category={category} />
        </div>
        <div className="task-actions">
          <button
            className="delete-icon-btn small"
            onClick={(e) => onDelete(e, listId, task.id)}
            title="Delete Task"
          >
            🗑
          </button>
          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            {task.priority[0]}
          </span>
        </div>
      </div>
    </li>
  );
};

export default TaskItemCompact;
