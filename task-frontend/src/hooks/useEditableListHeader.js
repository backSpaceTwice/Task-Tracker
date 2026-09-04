import { useState } from "react";

/**
 * Shared edit-state + handlers for a task list's title/description header.
 * Used by both TaskListCard (dashboard grid) and DetailView (full page) so
 * the two don't drift with independent copies of the same edit flow.
 */
export function useEditableListHeader(list, onUpdateList) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [editDescription, setEditDescription] = useState(list.description || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const startEdit = (e) => {
    e?.stopPropagation();
    setIsEditing(true);
  };

  const cancelEdit = (e) => {
    e?.stopPropagation();
    setIsEditing(false);
    setEditTitle(list.title);
    setEditDescription(list.description || "");
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editTitle.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdateList(list.id, { title: editTitle, description: editDescription });
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
    isUpdating,
    startEdit,
    cancelEdit,
    submitEdit,
  };
}
