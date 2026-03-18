import React, { useState } from 'react';

const TaskForm = ({ onSave, onCancel, isCreating, title: initialTitle = "" }) => {
  const [taskTitle, setTaskTitle] = useState(initialTitle);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      priority: taskPriority
    });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>New Task</h3>
      <div className="form-group">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task Title"
          required
          autoFocus
        />
      </div>
      <div className="form-group">
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Task Description"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <div className="priority-selector">
            {['LOW', 'MEDIUM', 'HIGH'].map(p => (
              <button
                key={p}
                type="button"
                className={`priority-btn ${p.toLowerCase()} ${taskPriority === p ? 'active' : ''}`}
                onClick={() => setTaskPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="save-btn" disabled={isCreating}>
          {isCreating ? "Adding..." : "Add"}
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
