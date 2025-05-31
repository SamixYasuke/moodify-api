REST API Endpoints Specification

1. Authentication APIs
   Sign-Up
   POST /api/auth/signup/email

Description: Register a new user with email and password.
Request Body:{
"username": "string",
"email": "string",
"password": "string" // min 8 characters
}

Response:{
"userId": "string",
"username": "string",
"email": "string",
"token": "string" // JWT token
}

POST /api/auth/signup/google

Description: Register or log in a user via Google OAuth.
Request Body:{
"googleToken": "string" // Google ID token
}

Response:{
"userId": "string",
"username": "string",
"email": "string",
"token": "string"
}

POST /api/auth/signup/apple

Description: Register or log in a user via Apple OAuth.
Request Body:{
"appleToken": "string" // Apple ID token
}

Response:{
"userId": "string",
"username": "string",
"email": "string",
"token": "string"
}

Sign-In
POST /api/auth/signin/email

Description: Authenticate a user with username and password.
Request Body:{
"username": "string",
"password": "string"
}

Response:{
"userId": "string",
"username": "string",
"email": "string",
"token": "string"
}

POST /api/auth/signin/google

Description: Authenticate a user via Google OAuth.
Request Body:{
"googleToken": "string"
}

Response:{
"userId": "string",
"username": "string",
"email": "string",
"token": "string"
}

POST /api/auth/signin/apple

Description: Authenticate a user via Apple OAuth.
Request Body:{
"appleToken": "string"
}

Response:{
"userId": "string",
"username": "string",
"email": "string",
"token": "string"
}

2. Mood Selection APIs
   POST /api/moods

Description: Set the user's current mood.
Request Body:{
"mood": "string" // "Energized", "Neutral", "Tired"
}

Response:{
"userId": "string",
"mood": "string",
"updatedAt": "string" // ISO 8601 timestamp
}

3. Dashboard APIs
   User Info
   GET /api/dashboard/user

Description: Retrieve the authenticated user's information.
Response:{
"userId": "string",
"username": "string",
"email": "string"
}

Add Task
POST /api/dashboard/tasks

Description: Create a new task for the authenticated user.
Request Body:{
"name": "string",
"time": "string", // e.g., "13:00"
"date": "string", // e.g., "2025-04-16"
"priority": "string", // "High", "Medium", "Low"
"mood": "string", // "Energized", "Neutral", "Tired"
"image": "string" // "img1", "img2", "img3", "img4"
}

Response:{
"taskId": "string",
"name": "string",
"time": "string",
"date": "string",
"priority": "string",
"mood": "string",
"image": "string",
"createdAt": "string"
}

Get Tasks
GET /api/dashboard/tasks

Description: Retrieve all tasks for the authenticated user.
Response:[
{
"taskId": "string",
"name": "string",
"time": "string",
"image": "string"
}
]

Filter Tasks
GET /api/dashboard/tasks/filter

Description: Retrieve tasks filtered by mood.
Query Parameters:
mood: "Energized" | "Neutral" | "Tired"

Response:[
{
"taskId": "string",
"name": "string",
"time": "string",
"image": "string"
}
]

Get Task Details
GET /api/dashboard/tasks/:taskId

Description: Retrieve detailed information for a specific task.
Path Parameters:
taskId: Task identifier

Response:{
"taskId": "string",
"name": "string",
"due": "string", // Combined date and time, e.g., "2025-04-16T13:00:00Z"
"mood": "string",
"progress": "number" // e.g., 0 to 100
}

Edit Task
PATCH /api/dashboard/tasks/:taskId

Description: Update an existing task.
Path Parameters:
taskId: Task identifier

Request Body:{
"name": "string",
"time": "string",
"date": "string",
"priority": "string",
"image": "string"
}

Response:{
"taskId": "string",
"name": "string",
"time": "string",
"date": "string",
"priority": "string",
"image": "string",
"updatedAt": "string"
}

Delete Task
DELETE /api/dashboard/tasks/:taskId

Description: Delete a specific task.
Path Parameters:
taskId: Task identifier

Response:{
"message": "Task deleted successfully"
}

4. Notifications APIs
   GET /api/notifications

Description: Retrieve upcoming task notifications and periodic mood check prompts.
Response:[
{
"notificationId": "string",
"type": "string", // "task" or "mood"
"message": "string", // e.g., "Task 'Meeting' is due at 13:00" or "How are you feeling?"
"createdAt": "string"
}
]

5. Calendar APIs
   GET /api/calendar

Description: Retrieve tasks for a specific day.
Query Parameters:
date: Date in format "YYYY-MM-DD" (e.g., "2025-04-16")

Response:[
{
"taskId": "string",
"name": "string",
"time": "string",
"mood": "string",
"image": "string"
}
]

6. Settings APIs
   PATCH /api/settings/profile/image

Description: Update the user's profile image.
Request Body:{
"image": "string" // URL or identifier for new profile image
}

Response:{
"userId": "string",
"image": "string",
"updatedAt": "string"
}

PATCH /api/settings/profile/username

Description: Update the user's username (primary key).
Request Body:{
"username": "string"
}

Response:{
"userId": "string",
"username": "string",
"updatedAt": "string"
}

PATCH /api/settings/profile/email

Description: Update the user's email and send a confirmation email.
Request Body:{
"email": "string"
}

Response:{
"message": "Email updated, confirmation sent"
}

PATCH /api/settings/theme

Description: Update the user's color theme preference.
Request Body:{
"theme": "string" // "Dark" or "Light"
}

Response:{
"userId": "string",
"theme": "string",
"updatedAt": "string"
}

PATCH /api/settings/reminder

Description: Update the user's reminder settings.
Request Body:{
"reminder": "string", // "5min", "10min", "30min", "1hr", "custom"
"customTime": "string" // Optional, required if reminder is "custom", e.g., "15min"
}

Response:{
"userId": "string",
"reminder": "string",
"customTime": "string | null",
"updatedAt": "string"
}

PATCH /api/settings/reminder/disable

Description: Turn off reminders for the user.
Response:{
"message": "Reminders disabled"
}
