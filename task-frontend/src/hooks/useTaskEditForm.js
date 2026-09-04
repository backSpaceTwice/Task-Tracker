import { useState } from "react";

/**
 * Shared edit-state + handlers for a single task's inline edit form and its
 * quick status-toggle checkbox. Used by both the compact (dashboard) and
 * detailed (list view) task rows so they share one source of truth instead
 * of two copies of the same field state.
 */
export function useTaskEditForm(task, listId, onUpdate, onPatchTask) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editDueDate, setEditDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : "");
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editStatus, setEditStatus] = useState(task.status);
  const [editCategoryId, setEditCategoryId] = useState(task.categoryId || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const startEdit = (e) => {
    e?.stopPropagation();
    setIsEditing(true);
  };

  const cancelEdit = (e) => {
    e?.stopPropagation();
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditCategoryId(task.categoryId || "");
  };

  const toggleStatus = async (e) => {
    e.stopPropagation();
    const newStatus = task.status === "OPEN" ? "CLOSED" : "OPEN";
    try {
      await onPatchTask(listId, task.id, { status: newStatus });
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdate(listId, task.id, {
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate,
        priority: editPriority,
        status: editStatus,
        categoryId: editCategoryId || null,
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isEditing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editDueDate,
    setEditDueDate,
    editPriority,
    setEditPriority,
    editStatus,
    setEditStatus,
    editCategoryId,
    setEditCategoryId,
    isUpdating,
    startEdit,
    cancelEdit,
    toggleStatus,
    submitEdit,
  };
}
