# Notification System Design
# Stage 1 – REST API Design
## REST API Endpoints

### 1. Get All Notifications

**Method:** GET

/api/notifications

### Request Headers
Authorization: Bearer <access_token>

### Sample Response

```json
{
  "notifications": [
    {
      "id": "d146095a",
      "type": "Placement",
      "message": "Hiring",
      "timestamp": "",
      "isRead": false or true
    }
  ]
}
### 2. Get a Notification

**Method:** GET

/api/notifications/{id}

Returns the complete information about a single notification.

### 3. Mark Notification as Read

**Method:** PATCH

/api/notifications/{id}/read


This endpoint updates the notification status after the student views it.


### 4. Delete Notification

**Method:** DELETE


/api/notifications/{id}


### 5. Get Only Unread Notifications

**Method:** GET


/api/notifications/unread


Returns only the notifications that the student has not opened yet.
## Notification Structure

Each notification contains the following information:

- Notification ID
- Notification Type
- Message
- Created Time
- Read Status

Example:

```json
{
    "id":"UUID",
    "type":"Placement",
    "message":"Amazon Hiring Drive",
    "timestamp":"2026-04-22T17:51:18",
    "isRead":false
}
```

---

## HTTP Headers

```
Authorization : Bearer Token
Content-Type : application/json
Accept : application/json
```

---

## Response Codes

| Status | Description |
|200|Request completed successfully|
|201|Resource created successfully|
|400|Invalid request|
|401|Unauthorized user|
|404|Requested resource not found|
|500|Internal server error|




# Stage 2 – Database Design

## Database Selection

For this notification system, I would use **PostgreSQL** because it is reliable, supports ACID transactions, and performs well for applications that require structured data. Since notifications have relationships with students, a relational database is a suitable choice.

PostgreSQL also provides indexing, partitioning, and replication features that help the application scale as the number of users and notifications increases.

---

## Database Tables

The system consists of two main tables:

### 1. Students

This table stores the details of every student.

| Column | Data Type | Description |
|---------|-----------|-------------|
| student_id | UUID | Primary Key |
| name | VARCHAR(100) | Student Name |
| email | VARCHAR(100) | Student Email |

---

### 2. Notifications

This table stores all notifications sent to students.

| Column | Data Type | Description |
|---------|-----------|-------------|
| notification_id | UUID | Primary Key |
| student_id | UUID | Foreign Key referencing Students |
| notification_type | VARCHAR(20) | Placement, Result or Event |
| message | TEXT | Notification Content |
| is_read | BOOLEAN | Indicates whether the notification has been viewed |
| created_at | TIMESTAMP | Notification creation time |

---

## Relationship

A single student can receive multiple notifications.

```
Student
   │
   │ 1
   │
   ▼
Notifications
   *
```

This represents a **One-to-Many** relationship.

## SQL Table Creation

### Students Table

```sql
CREATE TABLE students (
    student_id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY,
    student_id UUID NOT NULL,
    notification_type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id)
        REFERENCES students(student_id)
);
```


```sql
CREATE INDEX idx_student_id
ON notifications(student_id);

CREATE INDEX idx_notification_type
ON notifications(notification_type);

CREATE INDEX idx_created_at
ON notifications(created_at);

CREATE INDEX idx_is_read
ON notifications(is_read);
```


## Sample SQL Queries

### Get All Notifications of a Student

```sql
SELECT *
FROM notifications
WHERE student_id = ?
ORDER BY created_at DESC;
```

---

### Get Only Unread Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = ?
AND is_read = FALSE
ORDER BY created_at DESC;
```

---

### Get Placement Notifications

```sql
SELECT *
FROM notifications
WHERE notification_type = 'Placement'
ORDER BY created_at DESC;
```

---

### Mark Notification as Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE notification_id = ?;
```

---

### Delete a Notification

```sql
DELETE FROM notifications
WHERE notification_id = ?;
```




# Stage 3 – Query Optimization

## Problem

When the number of notifications becomes very large, fetching notifications for a student can take more time.

For example:

```sql
SELECT *
FROM notifications
WHERE student_id = ?
ORDER BY created_at DESC;
```

---

## Why is this query slow

This query may become slow because:

The database has to check many records.
There is no index on the `student_id` column.
Sorting all records takes extra time.


## Solution

We can create an index on the columns that are used frequently.

```sql
CREATE INDEX idx_student_created
ON notifications(student_id, created_at);
```

This helps the database find records much faster.

---

## Better Query

```sql
SELECT notification_id,
       notification_type,
       message,
       created_at
FROM notifications
WHERE student_id = ?
ORDER BY created_at DESC
LIMIT 20;
```

---

## Why is this query better?

It fetches only the required columns.
It returns only 20 records at a time.
The index makes searching faster.

---


# Stage 4 – System Design

## System Overview

This notification system has three main parts:

- React Frontend
- Spring Boot Backend
- MySQL Database

The frontend sends a request to the backend. The backend gets the required data from the database and sends it back to the frontend.

---

## Working Flow

Student

↓

React Frontend

↓

Spring Boot Backend

↓

MySql Database

↓

Response to Student

---




## Error Handling

The application should return proper status codes.

- 200 – Success
- 201 – Created
- 400 – Bad Request
- 401 – Unauthorized
- 404 – Not Found
- 500 – Internal Server Error

---

