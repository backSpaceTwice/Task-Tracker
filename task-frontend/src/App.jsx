import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/common/Header";
import Dashboard from "./components/TaskList/Dashboard";
import DetailView from "./components/DetailView/DetailView";

function App() {
  const [taskLists, setTaskLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isUpdatingList, setIsUpdatingList] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Navigation states
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'detail'
  const [selectedList, setSelectedList] = useState(null);

  const fetchTaskLists = () => {
    setLoading(true);
    fetch("http://localhost:8080/task-lists")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTaskLists(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Fetch failed: ${err.message}`);
        setLoading(false);
      });
  };

  const fetchSingleTaskList = (id) => {
    setLoading(true);
    fetch(`http://localhost:8080/task-lists/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSelectedList(data);
        setView("detail");
        setLoading(false);
      })
      .catch((err) => {
        setError(`Fetch failed: ${err.message}`);
        setLoading(false);
      });
  };

  const handleCreateTaskList = (listData) => {
    setIsCreatingList(true);
    fetch("http://localhost:8080/task-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then(() => {
        setIsCreatingList(false);
        fetchTaskLists();
      })
      .catch((err) => {
        setError(`Create failed: ${err.message}`);
        setIsCreatingList(false);
      });
  };

  const handleUpdateTaskList = async (listId, listData) => {
    setIsUpdatingList(true);
    try {
      const res = await fetch(`http://localhost:8080/task-lists/${listId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listId, ...listData }),
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const updatedList = await res.json();
      
      if (view === "detail") {
        setSelectedList(updatedList);
      } else {
        fetchTaskLists();
      }
      return updatedList;
    } catch (err) {
      setError(`Update failed: ${err.message}`);
      throw err;
    } finally {
      setIsUpdatingList(false);
    }
  };

  const handleDeleteTaskList = (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task list?")) return;

    setLoading(true);
    fetch(`http://localhost:8080/task-lists/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        if (view === "detail") {
          handleBackToDashboard();
        } else {
          fetchTaskLists();
        }
      })
      .catch((err) => {
        setError(`Delete failed: ${err.message}`);
        setLoading(false);
      });
  };

  const handleCreateTask = async (listId, taskData) => {
    setIsCreatingTask(true);
    try {
      const res = await fetch(`http://localhost:8080/task-lists/${listId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskData,
          dueDate: taskData.dueDate ? `${taskData.dueDate}T00:00:00` : null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      
      if (view === 'detail') {
        fetchSingleTaskList(listId);
      } else {
        fetchTaskLists();
      }
    } catch (err) {
      setError(`Task creation failed: ${err.message}`);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleUpdateTask = async (listId, taskId, taskData) => {
    try {
      const res = await fetch(`http://localhost:8080/task-lists/${listId}/tasks/${taskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          ...taskData,
          dueDate: taskData.dueDate && !taskData.dueDate.includes('T') 
            ? `${taskData.dueDate}T00:00:00` 
            : taskData.dueDate,
        }),
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      
      if (view === 'detail') {
        fetchSingleTaskList(listId);
      } else {
        fetchTaskLists();
      }
    } catch (err) {
      setError(`Task update failed: ${err.message}`);
      throw err;
    }
  };

  const handleDeleteTask = (e, listId, taskId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    fetch(`http://localhost:8080/task-lists/${listId}/tasks/${taskId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        if (view === "detail") {
          fetchSingleTaskList(listId);
        } else {
          fetchTaskLists();
        }
      })
      .catch((err) => {
        setError(`Delete failed: ${err.message}`);
        setLoading(false);
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

  return (
    <div className="container">
      <Header 
        view={view} 
        onBack={handleBackToDashboard} 
      />

      {error && <div className="error-msg" onClick={() => setError(null)}>{error} (Click to dismiss)</div>}

      {loading && taskLists.length === 0 && !selectedList ? (
        <div className="loading">Loading...</div>
      ) : (
        view === "dashboard" ? (
          <Dashboard 
            taskLists={taskLists}
            loading={loading}
            onViewList={fetchSingleTaskList}
            onUpdateList={handleUpdateTaskList}
            onDeleteList={handleDeleteTaskList}
            onCreateList={handleCreateTaskList}
            isCreating={isCreatingList}
            onAddTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <DetailView 
            list={selectedList}
            onUpdateList={handleUpdateTaskList}
            onDeleteList={handleDeleteTaskList}
            onAddTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            isUpdatingList={isUpdatingList}
            isCreatingTask={isCreatingTask}
          />
        )
      )}
    </div>
  );
}

export default App;
