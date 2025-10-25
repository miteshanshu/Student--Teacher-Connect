import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AssignmentCard from '../components/AssignmentCard';

// Teacher dashboard - teachers can create and manage their assignments
const TeacherDashboard = ({ user, onLogout }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    deadline: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  // Fetch all assignments for this teacher
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/assignments/teacher/${user._id}`);
      setAssignments(response.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  }, [user._id, API_BASE_URL]);

  // Load teacher's assignments when component mounts
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Update form field values
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields are filled
    if (!formData.title || !formData.description || !formData.subject || !formData.deadline) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      // Create assignment with teacher info
      await axios.post(`${API_BASE_URL}/assignments`, {
        ...formData,
        teacherId: user._id,
        teacherName: user.name
      });

      // Clear form and refresh list
      setFormData({
        title: '',
        description: '',
        subject: '',
        deadline: ''
      });
      setShowForm(false);
      fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating assignment');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete an assignment with confirmation
  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await axios.delete(`${API_BASE_URL}/assignments/${assignmentId}`);
        fetchAssignments();
      } catch (err) {
        setError('Error deleting assignment');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">📚 Teacher Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>

        {/* Create Assignment Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Create Assignment</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              {showForm ? '✕ Cancel' : '+ New Assignment'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Math Chapter 5 Exercises"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter assignment details..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
              >
                {submitting ? 'Creating...' : 'Create Assignment'}
              </button>
            </form>
          )}
        </div>

        {/* Assignments List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Assignments ({assignments.length})
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">Loading assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">No assignments created yet.</p>
              <p className="text-gray-500">Create your first assignment to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map(assignment => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  onDelete={handleDelete}
                  isTeacher={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;