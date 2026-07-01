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

---

