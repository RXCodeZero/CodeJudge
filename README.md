# CodeJudge: A Simple Online Coding Judge

**CodeJudge** is a full-stack web application that allows users to solve simple coding problems in a web-based IDE and get instant feedback by running their code against a set of predefined test cases. It is built with a React frontend and a Node.js/Express backend.

This project demonstrates a complete client-server architecture, state management in React, and secure code execution on a server.

---

## Features

* **Interactive Code Editor**: A feature-rich editor powered by react-ace with syntax highlighting, themes, and autocompletion.
* **Resizable IDE Layout**: A professional, multi-panel layout using Allotment that allows users to resize the problem description, editor, and console panes.
* **Real-time Judging**: Submit code to a backend service that executes it securely and evaluates it against multiple test cases.
* **Instant Feedback**: The UI updates immediately to show whether the solution was Accepted, resulted in a Wrong Answer, or produced a Runtime Error.
* **Problem Selection**: Easily switch between different coding problems.
* **CORS Handling**: The backend is correctly configured to handle cross-origin requests from the frontend.

---

## Tech Stack

### Frontend (Client)

* **React**: A JavaScript library for building user interfaces.
* **Vite**: A fast and modern frontend build tool.
* **Axios**: A promise-based HTTP client for making API calls to the backend.
* **React Ace**: A wrapper for the Ace code editor in React.
* **Allotment**: A React component for creating resizable split-views.
* **CSS**: Custom styling for a modern, dark-themed "LeetCode-ish" appearance.

### Backend (Server)

* **Node.js**: A JavaScript runtime for building the server.
* **Express.js**: A minimal and flexible Node.js web application framework.
* **cors**: A Node.js package for enabling CORS with various options.

---

## Project Structure

The project is divided into two main folders: frontend and backend.

```
/codejudge-project
├── /frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.css
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── /backend/
    ├── server.js       (or your main server file)
    └── package.json
```

---

## Setup and Installation

To run this project locally, you need to set up and run both the backend and frontend servers.

### 1. Backend Setup

First, navigate to the backend directory and install its dependencies:

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install
```

Ensure your `backend/package.json` includes `express` and `cors`:

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2"
  }
}
```

Start the backend server:

```bash
node server.js
```

The server will be running at [http://localhost:3001](http://localhost:3001).

### 2. Frontend Setup

In a new terminal window, navigate to the frontend directory:

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install
```

Ensure your `frontend/package.json` includes:

```json
{
  "dependencies": {
    "ace-builds": "^1.35.2",
    "allotment": "^0.2.0",
    "axios": "^1.7.2",
    "react": "^18.3.1",
    "react-ace": "^11.0.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.3.3"
  }
}
```

Start the frontend development server:

```bash
npm run dev
```

Your browser will open to [http://localhost:5173](http://localhost:5173), where you can interact with the application.

---

## How It Works

### Frontend Logic (`App.jsx`)

* **State Management**: Uses `useState` to manage the selected problem, editor code, and submission results.
* **API Call**: On clicking "Run", the `handleSubmit` function sends the user's code and problem ID to the backend via `axios.post`.
* **UI Updates**: Shows loading states and displays result feedback (Accepted, Wrong Answer, or Error).
* **Layout**: Uses `Allotment` for split-pane layout and `AceEditor` for the code editor interface.

### Backend Logic (`server.js`)

* **API Endpoint**: `POST /submit`
* **CORS Middleware**: `app.use(cors())` ensures cross-origin communication between frontend and backend.
* **Code Execution**:

```js
const executeCode = (userCode, input) => {
  const fn = new Function('a', 'b', userCode);
  return fn(...input);
};
```

* **Judging**: Iterates through predefined test cases, runs user code inside `try...catch` to handle errors.
* **Response**: Returns a JSON object with the result status and test case details.

---

## Customization and Extension

### Adding New Problems

#### Backend (`server.js`)

Add a new problem in the `problems` object:

```js
const problems = {
  "3": {
    title: "Subtract Two Numbers",
    description: "Given two numbers, return the first minus the second.",
    testCases: [
      { input: [10, 5], expectedOutput: 5 },
      { input: [5, 10], expectedOutput: -5 },
    ],
  },
};
```

#### Frontend (`App.jsx`)

Add a corresponding entry in the `problems` object:

```js
const problems = {
  "3": {
    title: "3. Subtract Two Numbers",
    description: "Given two numbers, `a` and `b`, return `a - b`.",
    defaultCode: `function solve(a, b) {\n  // Your code here\n  return a - b;\n}`
  },
};
```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
