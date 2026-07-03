const express = require("express");
const cors = require("cors");
const loggingMiddleware = require("logging-middleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Integrate the Logging Middleware
app.use(loggingMiddleware);

// Helper to generate UUID-like IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

// In-memory mock database of notifications
let notifications = [
  {
    id: "d146095a",
    type: "Placement",
    message: "Google Software Engineering Intern Hiring Drive open for registrations.",
    timestamp: "2026-07-03T09:30:00Z",
    isRead: false
  },
  {
    id: "e932b10c",
    type: "Result",
    message: "Semester 5 End Exams results have been declared. Check your portal.",
    timestamp: "2026-07-02T14:15:00Z",
    isRead: true
  },
  {
    id: "f832a81b",
    type: "Event",
    message: "Annual Cultural Fest 'Campus Beats 2026' volunteer registrations are open.",
    timestamp: "2026-07-01T10:00:00Z",
    isRead: false
  },
  {
    id: "a310c85e",
    type: "Placement",
    message: "Microsoft Full-Time Hiring: Coding Round scheduled for July 10.",
    timestamp: "2026-07-03T08:00:00Z",
    isRead: false
  },
  {
    id: "b450c92d",
    type: "Result",
    message: "Re-evaluation results for Mid-Term exams released.",
    timestamp: "2026-07-02T11:00:00Z",
    isRead: false
  },
  {
    id: "c890e71a",
    type: "Event",
    message: "Guest Lecture on 'Advanced Agentic Coding using LLMs' tomorrow at 2 PM.",
    timestamp: "2026-07-02T09:30:00Z",
    isRead: true
  },
  {
    id: "d991b22c",
    type: "Placement",
    message: "Amazon Placement Drive: PPT and Q&A session on Zoom tonight.",
    timestamp: "2026-07-03T09:40:00Z",
    isRead: false
  },
  {
    id: "f104d55b",
    type: "Result",
    message: "Machine Learning Elective project evaluations grade sheet published.",
    timestamp: "2026-06-30T16:45:00Z",
    isRead: false
  },
  {
    id: "a205e66c",
    type: "Event",
    message: "Workshop on Cloud Computing: Registrations close in 2 hours.",
    timestamp: "2026-07-02T08:00:00Z",
    isRead: false
  },
  {
    id: "b306f77d",
    type: "Placement",
    message: "Uber off-campus drive announced for graduating batch.",
    timestamp: "2026-07-01T15:30:00Z",
    isRead: true
  },
  {
    id: "c407a88e",
    type: "Result",
    message: "DBMS Lab exam marks updated on student portal.",
    timestamp: "2026-06-29T12:00:00Z",
    isRead: false
  },
  {
    id: "d508b99f",
    type: "Event",
    message: "Sports Club: Inter-college basketball tournament trials on Friday.",
    timestamp: "2026-06-28T09:00:00Z",
    isRead: false
  },
  {
    id: "e609c11a",
    type: "Placement",
    message: "Infosys placement registration deadline extended by 1 day.",
    timestamp: "2026-06-27T18:00:00Z",
    isRead: true
  },
  {
    id: "f701d22b",
    type: "Result",
    message: "Final Year Capstone Project Phase 1 approval list released.",
    timestamp: "2026-06-26T14:00:00Z",
    isRead: false
  },
  {
    id: "a802e33c",
    type: "Event",
    message: "Web Development Club: Hackathon info session at seminar hall.",
    timestamp: "2026-06-25T11:00:00Z",
    isRead: false
  },
  {
    id: "b903f44d",
    type: "Placement",
    message: "Adobe Tech-Intern profile applications are now open.",
    timestamp: "2026-07-03T10:15:00Z",
    isRead: false
  },
  {
    id: "c004a55e",
    type: "Result",
    message: "Advanced Java Quiz 2 results have been posted online.",
    timestamp: "2026-07-02T17:00:00Z",
    isRead: false
  },
  {
    id: "d105b66f",
    type: "Event",
    message: "Music Club: Acoustic night auditions this Thursday.",
    timestamp: "2026-07-01T14:00:00Z",
    isRead: true
  },
  {
    id: "e206c77a",
    type: "Placement",
    message: "TCS Ninja hiring registrations link is active.",
    timestamp: "2026-06-24T10:00:00Z",
    isRead: false
  },
  {
    id: "f307d88b",
    type: "Result",
    message: "Mobile App Development grades published in PDF format.",
    timestamp: "2026-06-23T16:00:00Z",
    isRead: false
  },
  {
    id: "a408e99c",
    type: "Event",
    message: "Coding Club: Weekly competitive programming contest starts at 6 PM.",
    timestamp: "2026-07-03T07:30:00Z",
    isRead: false
  },
  {
    id: "b509f00d",
    type: "Placement",
    message: "Goldman Sachs Aptitude Test details and admit cards dispatched.",
    timestamp: "2026-07-02T13:00:00Z",
    isRead: false
  },
  {
    id: "c601a11e",
    type: "Result",
    message: "Operating Systems subject supplementary exams results declared.",
    timestamp: "2026-07-01T11:30:00Z",
    isRead: true
  },
  {
    id: "d702b22f",
    type: "Event",
    message: "IEEE Student Chapter: Cyber Security seminar registrations open.",
    timestamp: "2026-06-22T09:00:00Z",
    isRead: false
  },
  {
    id: "e803c33a",
    type: "Placement",
    message: "Capgemini Recruitment Drive registration form link available.",
    timestamp: "2026-06-21T10:30:00Z",
    isRead: false
  }
];

// Helper to get type priority (Stage 6)
const getPriority = (type) => {
  switch (type) {
    case "Placement": return 3;
    case "Result": return 2;
    case "Event": return 1;
    default: return 0;
  }
};

// 1. Get All Notifications (with optional sorting/filtering)
app.get("/api/notifications", (req, res) => {
  try {
    let result = [...notifications];

    // Filter by type if query param exists
    const { type } = req.query;
    if (type && type !== "All") {
      result = result.filter(n => n.type.toLowerCase() === type.toLowerCase());
    }

    // Default sorting logic (Stage 6): Priority DESC, then Timestamp DESC
    result.sort((a, b) => {
      const prioA = getPriority(a.type);
      const prioB = getPriority(b.type);
      if (prioA !== prioB) {
        return prioB - prioA; // Higher priority first
      }
      return new Date(b.timestamp) - new Date(a.timestamp); // Newest first
    });

    res.status(200).json({ notifications: result });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 5. Get Only Unread Notifications
app.get("/api/notifications/unread", (req, res) => {
  try {
    const unread = notifications.filter(n => !n.isRead);
    res.status(200).json({ notifications: unread });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Get a Single Notification
app.get("/api/notifications/:id", (req, res) => {
  try {
    const { id } = req.params;
    const notification = notifications.find(n => n.id === id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. Mark Notification as Read
app.patch("/api/notifications/:id/read", (req, res) => {
  try {
    const { id } = req.params;
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Notification not found" });
    }
    notifications[index].isRead = true;
    res.status(200).json(notifications[index]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 4. Delete Notification
app.delete("/api/notifications/:id", (req, res) => {
  try {
    const { id } = req.params;
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Notification not found" });
    }
    notifications.splice(index, 1);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handling for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
