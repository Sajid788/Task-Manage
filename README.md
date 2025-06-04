# Task Management Application

A full-stack task management application with admin and user roles, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: JWT-based authentication with session invalidation
- **Admin Panel**:
  - Dashboard with statistics
  - User management (activate/deactivate users)
  - Task management with bulk actions and pagination
- **User Panel**:
  - Dashboard with task statistics
  - View assigned tasks with pagination

## Project Structure

```
task-management-app/
├── frontend/             # React frontend
└── backend/              # Express backend
    ├── config/           # Server configuration
    │   └── db.js         # Database connection
    ├── controllers/      # API controllers
    │   ├── adminController.js
    │   ├── authController.js
    │   └── taskController.js
    ├── middleware/       # Express middleware
    │   ├── auth.js
    │   └── role.js
    ├── models/           # Mongoose models
    │   ├── Task.js
    │   └── User.js
    ├── routes/           # API routes
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   └── taskRoutes.js
    ├── utils/            # Utility functions
    │   └── generateToken.js
    ├── .env              # Environment variables
    └── server.js         # Entry point
```

## Setup

### Prerequisites

- Node.js (v14 or newer)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the server directory:
   ```
   cd task-management-app/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-management-app
   JWT_SECRET=your_jwt_secret_key_should_be_complex_and_secure
   JWT_EXPIRY=24h
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd task-management-app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile

### Admin
- `GET /api/admin/stats` - Get admin dashboard statistics
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/status` - Update user status

### Tasks
- `GET /api/tasks` - Get tasks with pagination
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/bulk-update` - Update multiple tasks (admin only)

## Default Users

When you seed the database, the following users are created:

- Admin: admin@example.com / admin123
- User: sajid@gmail.com / user123
- User: user@gmail.com / user123
- User: mike@example.com / user123 

## Screenshot
![image](https://github.com/user-attachments/assets/539a0335-4a6e-45c3-a9ab-21884b3426aa)
![image](https://github.com/user-attachments/assets/f18344fb-2945-412e-92cf-f146291232f4)
![image](https://github.com/user-attachments/assets/860057b0-7f63-4920-b6d9-bc06dd426991)
![image](https://github.com/user-attachments/assets/c228aada-52a6-4c5e-9ca4-fcd3e15fd939)
![image](https://github.com/user-attachments/assets/46d9b11d-7a86-4726-8942-63bf7a828a02)
![image](https://github.com/user-attachments/assets/150095e7-e6d1-4772-8cb0-3719cef04be5)
![image](https://github.com/user-attachments/assets/40de70c6-a7c6-4d51-a69f-245d1d1c7101)
