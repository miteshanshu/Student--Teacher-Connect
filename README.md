# Student-Teacher Connect

A web application for connecting teachers and students. Teachers post assignments with deadlines; students view and filter assignments by subject.

**Author:** Mitesh Kumar Anshu  
**Email:** miteshanshu1@gmail.com

---

## Features

- Role-based registration (Teacher/Student)
- Teachers create assignments with title, description, subject, and deadline
- Students view all assignments with deadline tracking
- Filter assignments by subject
- Student submission tracking with completion status
- Responsive design (Desktop, Tablet, Mobile)
- Data persistence in MongoDB Atlas

---

## Tech Stack

**Frontend:** React, Tailwind CSS, Axios, React Router  
**Backend:** Node.js, Express.js, Mongoose (MongoDB ODM)  
**Database:** MongoDB Atlas (Cloud NoSQL)

---

## Installation & Setup

### Prerequisites
- Node.js v14+
- npm or yarn
- MongoDB Atlas account (pre-configured)

### Backend Setup

```powershell
cd "d:\student teacher\backend"
npm install
npm start
```

Expected: `✓ MongoDB connected successfully` and `🚀 Server running on http://localhost:5000`

### Frontend Setup

```powershell
cd "d:\student teacher\frontend"
npm install
npm start
```

Expected: `Compiled successfully!` and app opens at `http://localhost:3000`

---

## API Endpoints

### User Management
- `POST /api/users` - Register new user (teacher or student)
- `GET /api/users` - Fetch all users

Example:
```json
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "teacher"
}
```

### Assignment Management
- `POST /api/assignments` - Create new assignment
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/teacher/:teacherId` - Get specific teacher's assignments
- `DELETE /api/assignments/:assignmentId` - Delete assignment
- `POST /api/assignments/:assignmentId/submit` - Submit assignment

Example - Create Assignment:
```json
POST /api/assignments
{
  "title": "Biology Project",
  "description": "Research cell structure",
  "subject": "Biology",
  "deadline": "2024-02-15T23:59:00Z",
  "teacherId": "507f1f77bcf86cd799439011",
  "teacherName": "Ms. Smith"
}
```

---

## User Workflows

### Teachers
1. Register with "Teacher" role
2. Create assignments with title, description, subject, deadline
3. View all posted assignments in dashboard
4. Monitor student submissions
5. Delete assignments as needed

### Students
1. Register with "Student" role
2. View all available assignments in dashboard
3. Filter assignments by subject
4. Submit assignments to mark as completed
5. See "✓ Submitted" badge on completed work
6. View other students who submitted

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  role: "teacher" | "student",
  createdAt: Date
}
```

### Assignment Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  subject: String,
  deadline: Date,
  teacherId: ObjectId,
  teacherName: String,
  submittedStudents: [
    {
      studentId: ObjectId,
      studentName: String,
      submittedAt: Date
    }
  ],
  createdAt: Date
}
```

---

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb+srv://student:teacher123@student-teacher-connect.mongodb.net/student-teacher-connect?retryWrites=true&w=majority
```

### Frontend `.env` (Optional)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Project Structure

```
student-teacher/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Assignment.js         # Assignment schema
│   ├── routes/
│   │   ├── users.js              # User endpoints
│   │   └── assignments.js        # Assignment endpoints
│   ├── server.js                 # Express entry point
│   └── package.json
│
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssignmentCard.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── RoleSelection.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
```

---

## Core Requirements Verification

| Requirement | Status | Implementation |
|-------------|--------|-----------------|
| Role selection (Teacher/Student) | ✅ | RoleSelection.jsx |
| Teachers post assignments | ✅ | POST `/api/assignments` |
| Students view assignments | ✅ | GET `/api/assignments` in StudentDashboard |
| Subject filtering | ✅ | Filter dropdown in StudentDashboard |
| Student submission tracking | ✅ | Bonus feature |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect to MongoDB | Check MONGODB_URI in `.env`, verify IP whitelist |
| CORS error in browser | Backend CORS is enabled; ensure backend runs on port 5000 |
| Port already in use | Change PORT in `.env` or kill existing process |
| Cannot find module | Run `npm install` in both directories |
| API not responding | Ensure backend is running before frontend |

---

## Future Enhancements

- User authentication with JWT tokens
- Assignment grading system
- Comments and feedback between teacher and student
- Email notifications
- Progress analytics and statistics
- Automated deadline reminders
- Scoring and leaderboards
- Mobile app

---

## License

Open source for educational purposes.

---

**Ready to connect? Start both servers and register your first user!**