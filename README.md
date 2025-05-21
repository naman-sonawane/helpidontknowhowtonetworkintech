# Help I Don't Know How to Network in Tech

This is a full-stack web application designed to help individuals navigate networking in the tech industry. The project is built with modern web technologies and includes both frontend and backend components.

👑 Best use of GenAI at JAMHacks 9

## Project Structure

The project is organized into two main directories:

- `frontend/`: Contains the React/Vite-based frontend application
- `backend/`: Contains the Node.js/Express backend server

## Features

- User authentication and authorization
- Face recognition capabilities
- Modern UI built with Tailwind CSS
- RESTful API endpoints
- Real-time data processing

## Prerequisites

- Node.js (latest LTS version)
- npm or yarn package manager
- Modern web browser

## Installation Guide

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create a `.env` file):
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
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

3. Set up environment variables (create a `.env` file):
```
VITE_API_URL=http://localhost:3000
```

## Running the Application

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

### Production

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the backend in production mode:
```bash
cd backend
npm start
```

## Technologies Used

- Frontend:
  - React
  - Vite
  - Tailwind CSS
  - ESLint
  - PostCSS

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Face Recognition API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
