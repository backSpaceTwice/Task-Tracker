import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [taskLists, setTaskLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Edit states
  const [editingListId, setEditingListId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Navigation states
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'detail'
  const [selectedList, setSelectedList] = useState(null);

  const fetchTaskLists = () => {
    setLoading(true);
    fetch("http://localhost:8080/task-lists")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setTaskLists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(`Fetch failed: ${err.message}. Check backend logs and CORS settings.`);
        setLoading(false);
      });
  };

  const fetchSingleTaskList = (id) => {
    setLoading(true);
    fetch(`http://localhost:8080/task-lists/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setSelectedList(data);
        setView("detail");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(`Fetch failed: ${err.message}.`);
        setLoading(false);
      });
  };

  const handleCreateTaskList = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    fetch("http://localhost:8080/task-lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(() => {
        setNewTitle("");
        setNewDescription("");
        setIsCreating(false);
        fetchTaskLists();
      })
      .catch((err) => {
        console.error(err);
        setError(`Create failed: ${err.message}.`);
        setIsCreating(false);
      });
  };

  const startEditing = (e, list) => {
    e.stopPropagation(); // Prevent card click
    setEditingListId(list.id);
    setEditTitle(list.title);
    setEditDescription(list.description || "");
  };

  const cancelEditing = (e) => {
    e?.stopPropagation();
    setEditingListId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleUpdateTaskList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editTitle.trim()) return;

    setIsUpdating(true);
    fetch(`http://localhost:8080/task-lists/${editingListId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingListId,
        title: editTitle,
        description: editDescription,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((updatedList) => {
        setEditingListId(null);
        setIsUpdating(false);
        if (view === "detail") {
          setSelectedList(updatedList);
        } else {
          fetchTaskLists();
        }
      })
      .catch((err) => {
        console.error(err);
        setError(`Update failed: ${err.message}.`);
        setIsUpdating(false);
      });
  };

  const handleBackToDashboard = () => {
    setView("dashboard");
    setSelectedList(null);
    fetchTaskLists();
  };

  useEffect(() => {
    fetchTaskLists();
  }, []);

  if (loading && taskLists.length === 0 && !selectedList) 
    return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <header>
        <div className="header-title" onClick={handleBackToDashboard} style={{cursor: 'pointer'}}>
          <h1>Task Tracker</h1>
          {view === 'detail' && <span className="view-badge">Detail View</span>}
        </div>
        <div className="header-actions">
          {view === 'detail' && (
            <button className="back-btn" onClick={handleBackToDashboard}>
              ← Back to Dashboard
            </button>
          )}
          <button className="refresh-btn" onClick={view === 'dashboard' ? fetchTaskLists : () => fetchSingleTaskList(selectedList.id)}>
            Refresh Data
          </button>
        </div>
      </header>

      {error && <div className="error-msg">{error}</div>}

      {view === "dashboard" ? (
        <>
          <section className="create-section">
            <h2>Create New Task List</h2>
            <form onSubmit={handleCreateTaskList} className="create-form">
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
              <div 
                key={list.id} 
                className={`task-list-card clickable`}
                onClick={() => fetchSingleTaskList(list.id)}
              >
                {editingListId === list.id ? (
                  <form onSubmit={handleUpdateTaskList} className="edit-form">
                    <div className="form-group">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="edit-actions">
                      <button type="submit" className="save-btn" disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save"}
                      </button>
                      <button type="button" className="cancel-btn" onClick={cancelEditing}>
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
                          className="edit-icon-btn" 
                          onClick={(e) => startEditing(e, list)}
                          title="Edit Task List"
                        >
                          ✎
                        </button>
                        <span className="task-count">{list.count || 0} tasks</span>
                      </div>
                    </div>
                    <p className="description">{list.description}</p>
                  </>
                )}

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(list.progress || 0) * 100}%` }}
                  ></div>
                  <span className="progress-text">
                    {Math.round((list.progress || 0) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="detail-view">
          <div className="task-list-card main-card">
            {editingListId === selectedList.id ? (
              <form onSubmit={handleUpdateTaskList} className="edit-form">
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
                  <button type="submit" className="save-btn" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button type="button" className="cancel-btn" onClick={cancelEditing}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="task-list-header">
                  <h2>{selectedList.title}</h2>
                  <div className="header-actions">
                    <button 
                      className="edit-icon-btn" 
                      onClick={(e) => startEditing(e, selectedList)}
                      title="Edit Task List"
                    >
                      ✎
                    </button>
                    <span className="task-count">{selectedList.count || 0} tasks</span>
                  </div>
                </div>
                <p className="description large">{selectedList.description}</p>
              </>
            )}

            <div className="progress-bar large">
              <div
                className="progress-fill"
                style={{ width: `${(selectedList.progress || 0) * 100}%` }}
              ></div>
              <span className="progress-text">
                {Math.round((selectedList.progress || 0) * 100)}% Complete
              </span>
            </div>

            <div className="tasks-section">
              <h3>Tasks in this List</h3>
              {selectedList.tasks && selectedList.tasks.length > 0 ? (
                <ul className="task-items">
                  {selectedList.tasks.map((task) => (
                    <li key={task.id} className={`task-item status-${task.status.toLowerCase()}`}>
                      <div className="task-info">
                        <span className="task-title">{task.title}</span>
                        <div className="task-meta">
                          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                            {task.priority}
                          </span>
                          <span className="due-date">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                          </span>
                        </div>
                      </div>
                      <p className="task-desc">{task.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-tasks">No tasks found in this list.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
