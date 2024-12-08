# Todo Application

A full-stack Todo application built with React Native and Node.js.

## Features

- ✅ Create, edit, and delete todo items
- ✅ Mark todos as complete
- ✅ User authentication
- ✅ Cross-platform support (iOS, Android, Web)
- ✅ Real-time updates
- ✅ Concurrent user support

## Tech Stack

### Frontend
- React Native
- TypeScript
- Expo (for cross-platform development)
- React Navigation
- Redux Toolkit (state management)
- Axios (API calls)

### Backend
- Node.js
- Express.js
- MongoDB (database)
- JWT (authentication)
- TypeScript

## Project Structure

```
todo-app/
├── backend/                # Node.js server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── config/        # Configuration files
│   └── package.json
│
└── frontend/              # React Native app
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── screens/       # App screens
    │   ├── navigation/    # Navigation setup
    │   ├── services/      # API services
    │   ├── store/         # Redux store
    │   └── types/         # TypeScript types
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Expo CLI

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on specific platforms:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Todo Endpoints
- GET /api/todos - Get all todos
- POST /api/todos - Create new todo
- PUT /api/todos/:id - Update todo
- DELETE /api/todos/:id - Delete todo

## Testing

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
