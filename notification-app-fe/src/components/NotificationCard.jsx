import { Card, CardContent, Typography, Chip, Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";

export function NotificationCard({ notification, onMarkAsRead, onDelete }) {
  const { id, type, message, timestamp, isRead } = notification;

  // Priority styling based on Type (Stage 6 Priority: Placement = 3, Result = 2, Event = 1)
  const getTypeStyle = (notifType) => {
    switch (notifType) {
      case "Placement":
        return {
          label: "Placement (Prio 3)",
          color: "error", // Red/Orange for High Priority
          borderColor: "#d32f2f",
        };
      case "Result":
        return {
          label: "Result (Prio 2)",
          color: "primary", // Blue for Medium Priority
          borderColor: "#1976d2",
        };
      case "Event":
        return {
          label: "Event (Prio 1)",
          color: "success", // Green for Low Priority
          borderColor: "#2e7d32",
        };
      default:
        return {
          label: notifType || "Notification",
          color: "default",
          borderColor: "#757575",
        };
    }
  };

  const styleConfig = getTypeStyle(type);

  // Format date beautifully
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        borderLeft: `5px solid ${isRead ? "#cfd8dc" : styleConfig.borderColor}`,
        backgroundColor: isRead ? "#fcfcfc" : "#ffffff",
        boxShadow: isRead 
          ? "0 1px 3px rgba(0,0,0,0.05)" 
          : "0 4px 12px rgba(0,0,0,0.08)",
        opacity: isRead ? 0.85 : 1,
        "&:hover": {
          boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ pb: "16px !important" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" flexDirection="column" gap={1} flex={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={styleConfig.label}
                color={styleConfig.color}
                size="small"
                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
              />
              {!isRead && (
                <Chip
                  label="New"
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }}
                />
              )}
            </Box>

            <Typography
              variant="body1"
              fontWeight={isRead ? 400 : 600}
              color={isRead ? "text.secondary" : "text.primary"}
              sx={{
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {message}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {formatDate(timestamp)}
            </Typography>
          </Box>

          <Box display="flex" gap={0.5} ml={2}>
            {!isRead && onMarkAsRead && (
              <Tooltip title="Mark as Read">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onMarkAsRead(id)}
                  sx={{
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                    "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.12)" },
                  }}
                >
                  <DoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(id)}
                  sx={{
                    backgroundColor: "rgba(211, 47, 47, 0.04)",
                    "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.12)" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}