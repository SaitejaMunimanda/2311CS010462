import { useState, useEffect } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RefreshIcon from "@mui/icons-material/Refresh";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { notifications, loading, error, markAsRead, deleteNotification, refresh } = useNotifications();

  // Reset page when filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  // Helper to determine type priority (Stage 6)
  const getPriority = (type) => {
    switch (type) {
      case "Placement": return 3;
      case "Result": return 2;
      case "Event": return 1;
      default: return 0;
    }
  };

  // Filter local copy
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "All") return true;
    return n.type?.toLowerCase() === filter.toLowerCase();
  });

  // Sort local copy by Priority (Stage 6: Placement > Result > Event), then by Timestamp (Latest first)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    const prioA = getPriority(a.type);
    const prioB = getPriority(b.type);
    if (prioA !== prioB) {
      return prioB - prioA; // Higher priority first
    }
    return new Date(b.timestamp) - new Date(a.timestamp); // Newest first
  });

  // Pagination (10 notifications per page)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);
  
  // Adjust page if it falls outside the range (e.g. after items are deleted)
  const currentPage = page > totalPages ? Math.max(1, totalPages) : page;
  
  const displayedNotifications = sortedNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Compute real-time unread notifications count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Box 
      sx={{ 
        maxWidth: 720, 
        mx: "auto", 
        px: { xs: 2, sm: 3 }, 
        py: 5,
        backgroundColor: "#f8f9fa",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        mt: 4,
        mb: 4
      }}
    >
      {/* Header section with Badge and Refresh button */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Badge badgeContent={unreadCount} color="error" max={99} sx={{ "& .MuiBadge-badge": { fontWeight: "bold" } }}>
            <NotificationsIcon sx={{ fontSize: 32, color: "primary.main" }} />
          </Badge>
          <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: "-0.5px" }}>
            Notifications
          </Typography>
        </Stack>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={refresh}
          size="small"
          sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
        >
          Refresh
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Filters section */}
      <Box sx={{ marginBottom: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Showing {sortedNotifications.length} notifications
        </Typography>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={50} thickness={4.5} />
        </Box>
      )}

      {/* Error state */}
      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: "10px", mb: 2 }}>
          Failed to load notifications: {error}
        </Alert>
      )}

      {/* Empty state */}
      {!loading && !error && sortedNotifications.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: "10px", py: 2 }}>
          No {filter !== "All" ? `${filter} ` : ""}notifications found.
        </Alert>
      )}

      {/* Notifications list */}
      {!loading && !error && sortedNotifications.length > 0 && (
        <Stack spacing={1.5}>
          {displayedNotifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </Stack>
      )}

      {/* Pagination controls */}
      {!loading && !error && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="medium"
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 600,
                borderRadius: "8px"
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
}
