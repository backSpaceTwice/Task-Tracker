import React, { useState } from 'react';
import ProgressBar from '../common/ProgressBar';
import TaskItem from '../Task/TaskItem';
import TaskForm from '../Task/TaskForm';

const TaskListCard = ({ 
  list, 
  onView, 
  onUpdate, 
  onDelete, 
  onDeleteTask, 
  onUpdateTask,
  onPatchTask,
  onMarkAllCompleted,
  onAddTask,
  isCreatingTask,
  categories = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [editDescription, setEditDescription] = useState(list.description || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = (e) => {
    e?.stopPropagation();
    setIsEditing(false);
    setEditTitle(list.title);
    setEditDescription(list.description || "");
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editTitle.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdate(list.id, { title: editTitle, description: editDescription });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleAddTask = (e) => {
    e.stopPropagation();
    setShowAddTask(!showAddTask);
  };

  const handleSaveTask = async (taskData) => {
    await onAddTask(list.id, taskData);
    setShowAddTask(false);
  };

  const openTaskCount = list.tasks ? list.tasks.filter(t => t.status === 'OPEN').length : 0;

  return (
    <div 
      className={`task-list-card clickable`}
      onClick={() => onView(list.id)}
    >
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit} className="edit-form" onClick={(e) => e.stopPropagation()}>
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
              id="edit-description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
          <div className="edit-actions">
            <button type="submit" className="save-btn" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-list-header">
            <h2>{list.title}</h2>
            <div className="header-actions">
              {openTaskCount > 0 && (
                <button 
                  className="mark-all-btn" 
                  onClick={(e) => { e.stopPropagation(); onMarkAllCompleted(list.id); }}
                  title="Mark all as completed"
                >
                  ✓ All
                </button>
              )}
              <button 
                className="add-task-btn"
                onClick={toggleAddTask}
                title="Add Task"
              >
                +
              </button>
              <button 
                className="edit-icon-btn" 
                onClick={handleStartEdit}
                title="Edit Task List"
              >
                ✎
              </button>
              <button 
                className="delete-icon-btn" 
                onClick={(e) => onDelete(e, list.id)}
                title="Delete Task List"
              >
                🗑
              </button>
              <span className="task-count">{list.count || 0} tasks</span>
            </div>
          </div>
          <p className="description">{list.description}</p>
          
          <div className="tasks-section">
            {list.tasks && list.tasks.length > 0 && (
              <ul className="task-items">
                {list.tasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    listId={list.id} 
                    compact={true}
                    onUpdate={onUpdateTask}
                    onPatchTask={onPatchTask}
                    onDelete={onDeleteTask}
                    categories={categories}
                  />
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {showAddTask && (
        <div className="task-creation-overlay" onClick={(e) => e.stopPropagation()}>
          <TaskForm 
            onSave={handleSaveTask} 
            onCancel={() => setShowAddTask(false)} 
            isCreating={isCreatingTask}
            categories={categories}
          />
        </div>
      )}

      <ProgressBar progress={list.progress} />
    </div>
  );
};

export default TaskListCard;
