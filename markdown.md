# React + Node.js + MySQL Todo App with Authentication

**Full-Stack Todo Application**

- **User Authentication** (JWT)
- **Secure Password Hashing** (bcrypt)
- **MySQL Database**
- **State Management with Zustand**
- **Protected Routes**
- **Token Storage using Cookies**

---

## Features

- **Register & Login** (JWT Auth)
- **Add, Edit, Delete Todos**
- **Mark Todo as Complete/Incomplete**
- **Protected Routes** (Only logged-in users can access dashboard)

---

## Tech Stack

- **Frontend:** React, Zustand, Axios, React Router
- **Backend:** Node.js, Express, JWT, bcrypt
- **Database:** MySQL
- **Authentication:** JWT via Cookies

---

## Process to use

- **Database:**

1. Create a database name todo_app
2. Create two table name user and todos

- **Backend:**

1. Create .env file , name secret, PORT
2. install npm

- **Frontend:**

1. install npm

## 📂 Project Structure

project-root/
│
├── backend/
│ ├── server.js
│ ├── routes/
│ │ ├── auth.js
│ │ └── todos.js
│ ├── config/db.js
│ └── middleware/authMiddleware.js
│
└── frontend/
├── src/
│ ├── components/
│ │ ├── Login.js
│ │ ├── Register.js
│ │ └── TodoList.js
│ ├── store/useStore.js
│ └── App.js
