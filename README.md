# 🚀 CampusPulse – Ambassador Management System

CampusPulse is a full-stack web application designed to manage campus ambassador programs efficiently. It allows admins to assign tasks, ambassadors to complete them, and track performance through a leaderboard system.

---

## ✨ Features

### 👨‍🎓 Ambassador

* View assigned tasks
* Submit proof of completion
* Track total points
* View leaderboard ranking

### 🛠️ Admin

* Create and manage tasks
* View submissions
* Approve/reject submissions
* Points automatically updated

---

## 🔄 Workflow

Admin creates task
↓
Ambassador views task
↓
Ambassador submits proof
↓
Admin approves submission
↓
Points are added & leaderboard updates

---

## 🧱 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* SweetAlert2

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

---

## 📁 Project Structure

```
/frontend
  ├── pages
  ├── components
  ├── App.js

/backend
  ├── models
  ├── routes
  ├── server.js
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/your-username/campus-pulse.git
cd campus-pulse
```

---

### 2. Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URL=your_mongodb_connection_string
PORT=8000
```

Run server:

```
node server.js
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm start
```

---

## 🌐 API Endpoints

### Auth

* POST `/api/auth/signup`

### Tasks

* GET `/tasks`
* POST `/tasks`

### Submission

* POST `/submit`
* GET `/submissions/:userId`

### Admin

* PATCH `/approve/:id`

### Stats & Leaderboard

* GET `/user/stats/:userId`
* GET `/leaderboard`

---

## 📊 Future Improvements

* JWT Authentication
* Role-based access control
* File upload for proof (Cloudinary)
* Real-time leaderboard updates
* Admin analytics dashboard

---

## 👩‍💻 Author

Hadiya Shaikh
Full Stack Developer (MERN)

---

## 📌 Notes

* This project was built as part of a hackathon.
* Focused on clean UI, real-world workflow, and scalable backend design.

---

## ⭐ If you like this project

Give it a star and share feedback!
