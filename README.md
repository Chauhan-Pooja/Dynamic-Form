# React + Vite
This project is a React-based dynamic form generator that renders form fields from a JSON schema and submits data (including file uploads) to an Express.js backend.
# Folder Structure
The form contains Frontend as well as backend,
Frontend(Client) is coded in React.js, Javascript & Backend(Server) is coded in Node.js & Express.js
# Supports:
  - Text, Email, Number, Date
  - Select and Multi-select
  - File uploads with preview
  - Nested field groups (cards)
  - Validation for required fields and regex patterns
# Express.js backend handles
  - JSON form submissions
  - File uploads (Multer), uploads/ folder exists in the backend directory
  - Preview uploaded image
  - Auto-refresh after successful submission
  - Success message on submit
# Prerequisites
  - Node.js v14+
  - Postman
# Installation
  Server :
  - cd server
  - npm init -y
  - npm install express cors multer
  - Run Server : node Server.js / npm start
  - Server will run at: http://localhost:5000
  Client :
  - npm create vite@latest Client -- --template react
  - npm install
  - npm install express cors multer
  - npm install axios 
  - npm install --save-dev @vitejs/plugin-react
  - Run Client : npm run dev
  - React app will run at: http://localhost:3000
# Test API on Postman
URL: http://localhost:5000/submit-form
Method: POST
Json : {
  "name": "Pooja",
  "email": "pooja@example.com",
  "age": 28,
  "skills": ["React", "Node.js"],
  "profilePic": "uploads/abcd123.jpg"
}


