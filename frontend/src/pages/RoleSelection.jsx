import React, { useState } from 'react';
import axios from 'axios';

// Role selection page - users register as teacher or student
const RoleSelection = ({ onRoleSelect }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  // Handle user registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form fields
    if (!name || !email || !selectedRole) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting user registration:', { name, email, role: selectedRole });
      
      // Create user account
      const response = await axios.post(`${API_BASE_URL}/users`, {
        name,
        email,
        role: selectedRole
      });

      console.log('Registration successful:', response.data);
      const userData = response.data.user;
      
      // Navigate to appropriate dashboard
      onRoleSelect(selectedRole, userData);
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error creating user. Please check backend connection.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
          Student-Teacher Connect
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole('teacher')}
                className={`py-3 px-4 rounded-lg font-semibold transition ${
                  selectedRole === 'teacher'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👨‍🏫 Teacher
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-3 px-4 rounded-lg font-semibold transition ${
                  selectedRole === 'student'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👨‍🎓 Student
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleSelection;