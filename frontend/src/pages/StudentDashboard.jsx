import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AssignmentCard from '../components/AssignmentCard';

// Student dashboard - students view all assignments and can filter by subject
const StudentDashboard = ({ user, onLogout }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [submitMessage, setSubmitMessage] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  // Fetch all assignments from all teachers
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/assignments`);
      setAssignments(response.data);
      
      // Get list of unique subjects for filtering
      const uniqueSubjects = [...new Set(response.data.map(a => a.subject))];
      setSubjects(uniqueSubjects);
    } catch (err) {
      setError('Error fetching assignments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Load all assignments when component mounts
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Handle assignment submission
  const handleSubmitAssignment = async (assignmentId, studentId, studentName) => {
    try {
      await axios.post(`${API_BASE_URL}/assignments/${assignmentId}/submit`, {
        studentId,
        studentName
      });
      
      setSubmitMessage('✅ Assignment submitted successfully!');
      setTimeout(() => setSubmitMessage(''), 3000);
      
      // Refresh assignments to show updated submission status
      fetchAssignments();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error submitting assignment';
      setSubmitMessage(`❌ ${errorMsg}`);
      setTimeout(() => setSubmitMessage(''), 3000);
      console.error('Error submitting assignment:', err);
    }
  };

  // Filter assignments based on selected subject
  const filteredAssignments = filterSubject
    ? assignments.filter(a => a.subject === filterSubject)
    : assignments;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">📖 Student Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter by Subject</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterSubject('')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterSubject === ''
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Subjects
            </button>
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => setFilterSubject(subject)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filterSubject === subject
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Available Assignments ({filteredAssignments.length})
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button
                onClick={fetchAssignments}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          )}

          {submitMessage && (
            <div className={`px-4 py-3 rounded mb-4 ${
              submitMessage.includes('✅') 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {submitMessage}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">Loading assignments...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              {assignments.length === 0 ? (
                <>
                  <p className="text-gray-600 text-lg">No assignments available yet.</p>
                  <p className="text-gray-500">Check back soon for new assignments!</p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-lg">No assignments in this subject.</p>
                  <p className="text-gray-500">Try selecting a different subject.</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAssignments.map(assignment => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  isTeacher={false}
                  user={user}
                  onSubmit={handleSubmitAssignment}
                />
              ))}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchAssignments}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            🔄 Refresh Assignments
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;