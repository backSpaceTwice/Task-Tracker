import React, { useState } from 'react';
import TaskListCard from './TaskListCard';

const Dashboard = ({ 
  taskLists, 
  loading, 
  onViewList, 
  onUpdateList, 
  onDeleteList, 
  onCreateList,
  isCreating,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateList({ title: newTitle, description: newDescription });
    setNewTitle("");
    setNewDescription("");
  };

  return (
    <>
      <section className="create-section">
        <h2>Create New Task List</h2>
        <form onSubmit={handleCreateSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Work Projects"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Describe this task list..."
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Task List"}
          </button>
        </form>
      </section>

      <div className="task-lists-grid">
        {taskLists.length === 0 && !loading && <p>No task lists found.</p>}
        {taskLists.map((list) => (
          <TaskListCard 
            key={list.id} 
            list={list} 
            onView={onViewList}
            onUpdate={onUpdateList}
            onDelete={onDeleteList}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
