import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [taskLists, setTaskLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchTaskLists();
  }, []);

  if (loading && taskLists.length === 0) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <header>
        <h1>Task Tracker - Testing Dashboard</h1>
        <button className="refresh-btn" onClick={fetchTaskLists}>
          Refresh Data
        </button>
      </header>

      {error && <div className="error-msg">{error}</div>}

      <div className="task-lists-grid">
        {taskLists.length === 0 && !loading && <p>No task lists found.</p>}
        {taskLists.map((list) => (
          <div key={list.id} className="task-list-card">
            <div className="task-list-header">
              <h2>{list.title}</h2>
              <span className="task-count">{list.count || 0} tasks</span>
            </div>
            <p className="description">{list.description}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(list.progress || 0) * 100}%` }}
              ></div>
              <span className="progress-text">
                {Math.round((list.progress || 0) * 100)}%
              </span>
            </div>

            <div className="tasks-section">
              <h3>Tasks:</h3>
              {list.tasks && list.tasks.length > 0 ? (
                <ul className="task-items">
                  {list.tasks.map((task) => (
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
                <p className="no-tasks">No tasks in this list.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
