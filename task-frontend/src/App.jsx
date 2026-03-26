import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/common/Header";
import Dashboard from "./components/TaskList/Dashboard";
import DetailView from "./components/DetailView/DetailView";

function App() {
  const [taskLists, setTaskLists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isUpdatingList, setIsUpdatingList] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);

  // Navigation states
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'detail'
  const [selectedList, setSelectedList] = useState(null);

  const fetchCategories = () => {
    fetch("http://localhost:8080/categories")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        setError(`Fetch categories failed: ${err.message}`);
      });
  };

  const handleCreateCategory = (categoryData) => {
    fetch("http://localhost:8080/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then(() => {
        fetchCategories();
      })
      .catch((err) => {
        setError(`Create category failed: ${err.message}`);
      });
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm("Are you sure? This won't delete tasks but will remove them from this category.")) return;
    fetch(`http://localhost:8080/categories/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        fetchCategories();
        if (view === "detail" && selectedList) {
          fetchSingleTaskList(selectedList.id);
        } else {
          fetchTaskLists();
        }
      })
      .catch((err) => {
        setError(`Delete category failed: ${err.message}`);
      });
  };

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

  const handlePatchTask = async (listId, taskId, taskData) => {
    try {
      const res = await fetch(`http://localhost:8080/task-lists/${listId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      
      if (view === 'detail') {
        fetchSingleTaskList(listId);
      } else {
        fetchTaskLists();
      }
    } catch (err) {
      setError(`Task patch failed: ${err.message}`);
      throw err;
    }
  };

  const handleMarkAllCompleted = async (listId) => {
    const list = taskLists.find(l => l.id === listId) || (selectedList?.id === listId ? selectedList : null);
    if (!list || !list.tasks) return;
    
    const openTasks = list.tasks.filter(t => t.status === 'OPEN');
    if (openTasks.length === 0) return;

    if (!window.confirm(`Mark all ${openTasks.length} open tasks as completed?`)) return;

    setLoading(true);
    try {
      await Promise.all(openTasks.map(task => 
        fetch(`http://localhost:8080/task-lists/${listId}/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: 'CLOSED' }),
        })
      ));
      
      if (view === 'detail') {
        fetchSingleTaskList(listId);
      } else {
        fetchTaskLists();
      }
    } catch (err) {
      setError(`Failed to mark all completed: ${err.message}`);
      setLoading(false);
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
    fetchCategories();
  }, []);

  return (
    <div className="container">
      <Header 
        view={view} 
        onBack={handleBackToDashboard} 
        onManageCategories={() => setIsManagingCategories(true)}
      />

      {error && <div className="error-msg" onClick={() => setError(null)}>{error} (Click to dismiss)</div>}

      {isManagingCategories && (
        <div className="modal-overlay" onClick={() => setIsManagingCategories(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Categories</h2>
              <button className="close-btn" onClick={() => setIsManagingCategories(false)}>✕</button>
            </div>
            <div className="category-manager-container">
              <form onSubmit={(e) => {
                e.preventDefault();
                const title = e.target.title.value;
                const color = e.target.color.value;
                if (title) {
                  handleCreateCategory({ title, color });
                  e.target.reset();
                }
              }} className="category-form">
                <input name="title" placeholder="Category Title" required />
                <input name="color" type="color" defaultValue="#3b82f6" />
                <button type="submit" className="save-btn">Add</button>
              </form>
              <ul className="category-list">
                {categories.map(cat => (
                  <li key={cat.id} className="category-item">
                    <span className="category-color-dot" style={{ backgroundColor: cat.color }}></span>
                    <span className="category-title">{cat.title}</span>
                    <span className="category-count">({cat.taskCount || 0} tasks)</span>
                    <button className="delete-btn small" onClick={() => handleDeleteCategory(cat.id)}>🗑</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

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
            onPatchTask={handlePatchTask}
            onMarkAllCompleted={handleMarkAllCompleted}
            onDeleteTask={handleDeleteTask}
            categories={categories}
          />
        ) : (
          <DetailView 
            list={selectedList}
            onUpdateList={handleUpdateTaskList}
            onDeleteList={handleDeleteTaskList}
            onAddTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onPatchTask={handlePatchTask}
            onMarkAllCompleted={handleMarkAllCompleted}
            onDeleteTask={handleDeleteTask}
            isUpdatingList={isUpdatingList}
            isCreatingTask={isCreatingTask}
            categories={categories}
          />
        )
      )}
    </div>
  );
}

export default App;
