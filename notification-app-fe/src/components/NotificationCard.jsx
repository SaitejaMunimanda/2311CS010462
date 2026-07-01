import { Card, CardContent, Typography, Chip } from "@mui/material";

export function NotificationCard({ notification }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Chip
          label={notification.Type}
          color="primary"
          size="small"
        />

        <Typography variant="h6" sx={{ mt: 1 }}>
          {notification.Message}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {notification.Timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}