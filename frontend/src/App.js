import React, { useState } from 'react';
import RoleSelection from './pages/RoleSelection';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Main app component - handles routing between pages
function App() {
  const [currentPage, setCurrentPage] = useState('roleSelection');
  const [user, setUser] = useState(null);

  // Handle user registration and navigate to appropriate dashboard
  const handleRoleSelect = (role, userData) => {
    setUser(userData);
    if (role === 'teacher') {
      setCurrentPage('teacherDashboard');
    } else {
      setCurrentPage('studentDashboard');
    }
  };

  // Handle logout - return to role selection
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('roleSelection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Show role selection page */}
      {currentPage === 'roleSelection' && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}
      
      {/* Show teacher dashboard */}
      {currentPage === 'teacherDashboard' && user && (
        <TeacherDashboard user={user} onLogout={handleLogout} />
      )}
      
      {/* Show student dashboard */}
      {currentPage === 'studentDashboard' && user && (
        <StudentDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;