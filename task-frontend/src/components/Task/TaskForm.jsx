import React, { useState } from 'react';

const TaskForm = ({ onSave, onCancel, isCreating, categories = [], title: initialTitle = "" }) => {
  const [taskTitle, setTaskTitle] = useState(initialTitle);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [taskCategoryId, setTaskCategoryId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      priority: taskPriority,
      categoryId: taskCategoryId || null
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
          <label>Category</label>
          <select 
            value={taskCategoryId} 
            onChange={(e) => setTaskCategoryId(e.target.value)}
          >
            <option value="">No Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
        </div>
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
