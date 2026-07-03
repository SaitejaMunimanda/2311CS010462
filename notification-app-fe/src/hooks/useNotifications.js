import { useState, useEffect, useCallback } from "react";
import { fetchNotifications, markAsRead, deleteNotification } from "../api/notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications ?? []);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      // Optimistically or refetch to get updated list
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      setError(err.message || "Failed to mark notification as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete notification");
    }
  };

  const total = notifications.length;

  return {
    notifications,
    total,
    loading,
    error,
    markAsRead: handleMarkAsRead,
    deleteNotification: handleDelete,
    refresh: load,
  };
}
