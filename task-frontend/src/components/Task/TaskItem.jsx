import React, { useState } from 'react';

const TaskItem = ({ task, listId, onUpdate, onDelete, compact = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editDueDate, setEditDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : "");
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editStatus, setEditStatus] = useState(task.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = (e) => {
    e?.stopPropagation();
    setIsEditing(false);
    // Reset to current task values
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDueDate(task.dueDate ? task.dueDate.split('T')[0] : "");
    setEditPriority(task.priority);
    setEditStatus(task.status);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdate(listId, task.id, {
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate,
        priority: editPriority,
        status: editStatus
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isEditing) {
    return (
      <li className={`task-item status-${task.status.toLowerCase()} editing`} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="task-edit-form">
          <div className="form-group">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          {!compact && (
            <div className="form-group">
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
              />
            </div>
          )}
          <div className={`form-row ${compact ? 'small' : ''}`}>
            {!compact && (
              <div className="form-group">
                <label>Due</label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
              </div>
            )}
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
            {compact && (
              <div className="edit-actions">
                <button type="submit" className="save-btn" disabled={isUpdating}>✓</button>
                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>✕</button>
              </div>
            )}
          </div>
          {!compact && (
            <div className="form-group">
              <label>Priority</label>
              <div className="priority-selector small">
                {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-btn ${p.toLowerCase()} ${editPriority === p ? 'active' : ''}`}
                    onClick={() => setEditPriority(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!compact && (
            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={isUpdating}>
                {isUpdating ? "..." : "Save"}
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                ✕
              </button>
            </div>
          )}
        </form>
      </li>
    );
  }

  return (
    <li 
      className={`task-item status-${task.status.toLowerCase()} clickable`}
      onClick={handleStartEdit}
    >
      <div className="task-info">
        <span className="task-title">{task.title}</span>
        <div className={compact ? "task-actions" : "task-meta"}>
          {!compact && (
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
          )}
          {compact && (
            <button 
              className="delete-icon-btn small" 
              onClick={(e) => onDelete(e, listId, task.id)}
              title="Delete Task"
            >
              🗑
            </button>
          )}
          <span className={compact ? `priority-badge priority-${task.priority.toLowerCase()}` : "due-date"}>
            {compact ? task.priority[0] : (task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date")}
          </span>
        </div>
      </div>
      {!compact && <p className="task-desc">{task.description}</p>}
    </li>
  );
};

export default TaskItem;
