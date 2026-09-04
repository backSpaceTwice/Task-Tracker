import React from 'react';
import CategoryBadge from '../common/CategoryBadge';
import PrioritySelector from '../common/PrioritySelector';
import { useTaskEditForm } from '../../hooks/useTaskEditForm';

const TaskItemDetailed = ({ task, listId, onUpdate, onPatchTask, onDelete, categories = [] }) => {
  const {
    isEditing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editDueDate,
    setEditDueDate,
    editPriority,
    setEditPriority,
    editStatus,
    setEditStatus,
    editCategoryId,
    setEditCategoryId,
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
          <div className="form-group">
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Due</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
            </div>
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
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
              >
                <option value="">No Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <PrioritySelector value={editPriority} onChange={setEditPriority} small />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={isUpdating}>
              {isUpdating ? "..." : "Save"}
            </button>
            <button type="button" className="cancel-btn" onClick={cancelEdit}>
              ✕
            </button>
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
        <div className="task-meta">
          <div className="header-actions">
            <button
              className="delete-icon-btn small"
              onClick={(e) => onDelete(e, listId, task.id)}
              title="Delete Task"
            >
              🗑
            </button>
            <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          </div>
          <span className="due-date">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
          </span>
        </div>
      </div>
      <p className="task-desc">{task.description}</p>
    </li>
  );
};

export default TaskItemDetailed;
