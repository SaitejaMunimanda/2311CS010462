const API_BASE_URL = "http://localhost:5000/api";

export async function fetchNotifications() {
  const response = await fetch(`${API_BASE_URL}/notifications`);
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }
  return response.json();
}

export async function markAsRead(id) {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to mark notification ${id} as read`);
  }
  return response.json();
}

export async function deleteNotification(id) {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete notification ${id}`);
  }
  return response.json();
}
