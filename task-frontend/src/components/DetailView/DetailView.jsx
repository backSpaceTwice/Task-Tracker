import React, { useState } from 'react';
import ProgressBar from '../common/ProgressBar';
import TaskItem from '../Task/TaskItem';
import TaskForm from '../Task/TaskForm';

const DetailView = ({ 
  list, 
  onUpdateList, 
  onDeleteList, 
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  isUpdatingList,
  isCreatingTask
}) => {
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [editDescription, setEditDescription] = useState(list.description || "");
  const [showAddTask, setShowAddTask] = useState(false);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      await onUpdateList(list.id, { title: editTitle, description: editDescription });
      setIsEditingHeader(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTask = async (taskData) => {
    await onAddTask(list.id, taskData);
    setShowAddTask(false);
  };

  return (
    <div className="detail-view">
      <div className="task-list-card main-card">
        {isEditingHeader ? (
          <form onSubmit={handleUpdateSubmit} className="edit-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
              />
            </div>
            <div className="edit-actions">
              <button type="submit" className="save-btn" disabled={isUpdatingList}>
                {isUpdatingList ? "Saving..." : "Save"}
              </button>
              <button type="button" className="cancel-btn" onClick={() => setIsEditingHeader(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="task-list-header">
              <h2>{list.title}</h2>
              <div className="header-actions">
                <button 
                  className="add-task-btn"
                  onClick={() => setShowAddTask(!showAddTask)}
                >
                  {showAddTask ? "Cancel Add" : "+ Add Task"}
                </button>
                <button 
                  className="edit-icon-btn" 
                  onClick={() => setIsEditingHeader(true)}
                  title="Edit Task List"
                >
                  ✎
                </button>
                <button 
                  className="delete-icon-btn" 
                  onClick={(e) => onDeleteList(e, list.id)}
                  title="Delete Task List"
                >
                  🗑
                </button>
                <span className="task-count">{list.count || 0} tasks</span>
              </div>
            </div>
            <p className="description large">{list.description}</p>
          </>
        )}

        {showAddTask && (
          <div className="task-creation-inline">
            <TaskForm 
              onSave={handleSaveTask} 
              onCancel={() => setShowAddTask(false)}
              isCreating={isCreatingTask}
              title={list.title}
            />
          </div>
        )}

        <ProgressBar progress={list.progress} large={true} />

        <div className="tasks-section">
          <h3>Tasks in this List</h3>
          {list.tasks && list.tasks.length > 0 ? (
            <ul className="task-items">
              {list.tasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  listId={list.id} 
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </ul>
          ) : (
            <p className="no-tasks">No tasks found in this list.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailView;
