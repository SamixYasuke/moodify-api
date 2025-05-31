# API Documentation

---

## 1. Authentication APIs

### Sign-Up

#### `POST /api/auth/signup/email`

**Description:** Register a new user with email and password.

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string" // min 8 characters
}
```

**Response:**

```json
{
  "userId": "string",
  "username": "string",
  "email": "string",
  "token": "string" // JWT token
}
```

#### `POST /api/auth/signup/google`

**Description:** Register or log in a user via Google OAuth.

**Request Body:**

```json
{
  "googleToken": "string" // Google ID token
}
```

**Response:**

```json
{
  "userId": "string",
  "username": "string",
  "email": "string",
  "token": "string"
}
```

#### `POST /api/auth/signup/apple`

**Description:** Register or log in a user via Apple OAuth.

**Request Body:**

```json
{
  "appleToken": "string" // Apple ID token
}
```

**Response:**

```json
{
  "userId": "string",
  "username": "string",
  "email": "string",
  "token": "string"
}
```

### Sign-In

#### `POST /api/auth/signin/email`

**Description:** Authenticate a user with username and password.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "userId": "string",
  "username": "string",
  "email": "string",
  "token": "string"
}
```

#### `POST /api/auth/signin/google`

**Description:** Authenticate a user via Google OAuth.

**Request Body:**

```json
{
  "googleToken": "string"
}
```

**Response:**

```json
{
  "userId": "string",
  "username": "string",
  "email": "string",
  "token": "string"
}
```

#### `POST /api/auth/signin/apple`

**Description:** Authenticate a user via Apple OAuth.

**Request Body:**

```json
{
  "appleToken": "string"
}
```

**Response:**

```json
{
  "userId": "string",
  "username": "string",
  "email": "string",
  "token": "string"
}
```

---

## 2. Mood Selection APIs

### `POST /api/moods`

**Description:** Set the user's current mood.

**Request Body:**

```json
{
  "mood": "string" // "Energized", "Neutral", "Tired"
}
```

**Response:**

```json
{
  "userId": "string",
  "mood": "string",
  "updatedAt": "string" // ISO 8601 timestamp
}
```

---

## 3. Dashboard APIs

### User Info

#### `GET /api/dashboard/user`

**Description:** Retrieve the authenticated user's information.

**Response:**

```json
{
  "userId": "string",
  "username": "string",
  "email": "string"
}
```

### Add Task

#### `POST /api/dashboard/tasks`

**Description:** Create a new task for the authenticated user.

**Request Body:**

```json
{
  "name": "string",
  "time": "string", // e.g., "13:00"
  "date": "string", // e.g., "2025-04-16"
  "priority": "string", // "High", "Medium", "Low"
  "mood": "string", // "Energized", "Neutral", "Tired"
  "image": "string" // "img1", "img2", "img3", "img4"
}
```

**Response:**

```json
{
  "taskId": "string",
  "name": "string",
  "time": "string",
  "date": "string",
  "priority": "string",
  "mood": "string",
  "image": "string",
  "createdAt": "string"
}
```

### Get Tasks

#### `GET /api/dashboard/tasks`

**Description:** Retrieve all tasks for the authenticated user.

**Response:**

```json
[
  {
    "taskId": "string",
    "name": "string",
    "time": "string",
    "image": "string"
  }
]
```

### Filter Tasks

#### `GET /api/dashboard/tasks/filter`

**Description:** Retrieve tasks filtered by mood.

**Query Parameters:**

- `mood`: `"Energized" | "Neutral" | "Tired"`

**Response:**

```json
[
  {
    "taskId": "string",
    "name": "string",
    "time": "string",
    "image": "string"
  }
]
```

### Get Task Details

#### `GET /api/dashboard/tasks/:taskId`

**Description:** Retrieve detailed information for a specific task.

**Path Parameters:**

- `taskId`: Task identifier

**Response:**

```json
{
  "taskId": "string",
  "name": "string",
  "due": "string", // "2025-04-16T13:00:00Z"
  "mood": "string",
  "progress": "number" // e.g., 0 to 100
}
```

### Edit Task

#### `PATCH /api/dashboard/tasks/:taskId`

**Description:** Update an existing task.

**Path Parameters:**

- `taskId`: Task identifier

**Request Body:**

```json
{
  "name": "string",
  "time": "string",
  "date": "string",
  "priority": "string",
  "image": "string"
}
```

**Response:**

```json
{
  "taskId": "string",
  "name": "string",
  "time": "string",
  "date": "string",
  "priority": "string",
  "image": "string",
  "updatedAt": "string"
}
```

### Delete Task

#### `DELETE /api/dashboard/tasks/:taskId`

**Description:** Delete a specific task.

**Path Parameters:**

- `taskId`: Task identifier

**Response:**

```json
{
  "message": "Task deleted successfully"
}
```

---

## 4. Notifications APIs

### `GET /api/notifications`

**Description:** Retrieve upcoming task notifications and periodic mood check prompts.

**Response:**

```json
[
  {
    "notificationId": "string",
    "type": "string", // "task" or "mood"
    "message": "string",
    "createdAt": "string"
  }
]
```

---

## 5. Calendar APIs

### `GET /api/calendar`

**Description:** Retrieve tasks for a specific day.

**Query Parameters:**

- `date`: `"YYYY-MM-DD"` (e.g., "2025-04-16")

**Response:**

```json
[
  {
    "taskId": "string",
    "name": "string",
    "time": "string",
    "mood": "string",
    "image": "string"
  }
]
```

---

## 6. Settings APIs

### Update Profile Image

#### `PATCH /api/settings/profile/image`

**Request Body:**

```json
{
  "image": "string" // URL or identifier
}
```

**Response:**

```json
{
  "userId": "string",
  "image": "string",
  "updatedAt": "string"
}
```

### Update Username

#### `PATCH /api/settings/profile/username`

**Request Body:**

```json
{
  "username": "string"
}
```

**Response:**

```json
{
  "userId": "string",
  "username": "string",
  "updatedAt": "string"
}
```

### Update Email

#### `PATCH /api/settings/profile/email`

**Request Body:**

```json
{
  "email": "string"
}
```

**Response:**

```json
{
  "message": "Email updated, confirmation sent"
}
```

### Update Theme

#### `PATCH /api/settings/theme`

**Request Body:**

```json
{
  "theme": "string" // "Dark" or "Light"
}
```

**Response:**

```json
{
  "userId": "string",
  "theme": "string",
  "updatedAt": "string"
}
```

### Update Reminder Settings

#### `PATCH /api/settings/reminder`

**Request Body:**

```json
{
  "reminder": "string", // "5min", "10min", "30min", "1hr", "custom"
  "customTime": "string" // Optional if reminder is "custom"
}
```

**Response:**

```json
{
  "userId": "string",
  "reminder": "string",
  "customTime": "string | null",
  "updatedAt": "string"
}
```

### Disable Reminders

#### `PATCH /api/settings/reminder/disable`

**Response:**

```json
{
  "message": "Reminders disabled"
}
```
