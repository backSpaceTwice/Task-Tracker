import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/common/Header";
import Dashboard from "./components/TaskList/Dashboard";
import DetailView from "./components/DetailView/DetailView";
import { apiRequest, normalizeDueDate } from "./api/client";

function App() {
  const [taskLists, setTaskLists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);

  // Navigation states
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'detail'
  const [selectedList, setSelectedList] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await apiRequest("/categories");
      setCategories(data);
    } catch (err) {
      setError(`Fetch categories failed: ${err.message}`);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      await apiRequest("/categories", { method: "POST", body: categoryData });
      await fetchCategories();
    } catch (err) {
      setError(`Create category failed: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure? This won't delete tasks but will remove them from this category.")) return;

    try {
      await apiRequest(`/categories/${id}`, { method: "DELETE" });
      await fetchCategories();
      if (view === "detail" && selectedList) {
        await fetchSingleTaskList(selectedList.id);
      } else {
        await fetchTaskLists();
      }
    } catch (err) {
      setError(`Delete category failed: ${err.message}`);
    }
  };

  const fetchTaskLists = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/task-lists");
      setTaskLists(data);
    } catch (err) {
      setError(`Fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleTaskList = async (id) => {
    setLoading(true);
    try {
      const data = await apiRequest(`/task-lists/${id}`);
      setSelectedList(data);
      setView("detail");
    } catch (err) {
      setError(`Fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTaskList = async (listData) => {
    setIsCreatingList(true);
    try {
      await apiRequest("/task-lists", { method: "POST", body: listData });
      await fetchTaskLists();
    } catch (err) {
      setError(`Create failed: ${err.message}`);
    } finally {
      setIsCreatingList(false);
    }
  };

  const handleUpdateTaskList = async (listId, listData) => {
    try {
      const updatedList = await apiRequest(`/task-lists/${listId}`, {
        method: "PUT",
        body: { id: listId, ...listData },
      });

      if (view === "detail") {
        setSelectedList(updatedList);
      } else {
        await fetchTaskLists();
      }
      return updatedList;
    } catch (err) {
      setError(`Update failed: ${err.message}`);
      throw err;
    }
  };

  const handleDeleteTaskList = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task list?")) return;

    setLoading(true);
    try {
      await apiRequest(`/task-lists/${id}`, { method: "DELETE" });
      if (view === "detail") {
        handleBackToDashboard();
      } else {
        await fetchTaskLists();
      }
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
      setLoading(false);
    }
  };

  const handleCreateTask = async (listId, taskData) => {
    setIsCreatingTask(true);
    try {
      await apiRequest(`/task-lists/${listId}/tasks`, {
        method: "POST",
        body: { ...taskData, dueDate: normalizeDueDate(taskData.dueDate) },
      });

      if (view === "detail") {
        await fetchSingleTaskList(listId);
      } else {
        await fetchTaskLists();
      }
    } catch (err) {
      setError(`Task creation failed: ${err.message}`);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleUpdateTask = async (listId, taskId, taskData) => {
    try {
      await apiRequest(`/task-lists/${listId}/tasks/${taskId}`, {
        method: "POST",
        body: { id: taskId, ...taskData, dueDate: normalizeDueDate(taskData.dueDate) },
      });

      if (view === "detail") {
        await fetchSingleTaskList(listId);
      } else {
        await fetchTaskLists();
      }
    } catch (err) {
      setError(`Task update failed: ${err.message}`);
      throw err;
    }
  };

  const handlePatchTask = async (listId, taskId, taskData) => {
    try {
      await apiRequest(`/task-lists/${listId}/tasks/${taskId}`, {
        method: "PATCH",
        body: taskData,
      });

      if (view === "detail") {
        await fetchSingleTaskList(listId);
      } else {
        await fetchTaskLists();
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
        apiRequest(`/task-lists/${listId}/tasks/${task.id}`, {
          method: "PATCH",
          body: { status: 'CLOSED' },
        })
      ));

      if (view === 'detail') {
        await fetchSingleTaskList(listId);
      } else {
        await fetchTaskLists();
      }
    } catch (err) {
      setError(`Failed to mark all completed: ${err.message}`);
      setLoading(false);
    }
  };

  const handleDeleteTask = async (e, listId, taskId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    try {
      await apiRequest(`/task-lists/${listId}/tasks/${taskId}`, { method: "DELETE" });
      if (view === "detail") {
        await fetchSingleTaskList(listId);
      } else {
        await fetchTaskLists();
      }
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
      setLoading(false);
    }
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
            isCreatingTask={isCreatingTask}
            categories={categories}
          />
        )
      )}
    </div>
  );
}

export default App;
