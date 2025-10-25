import React, { useState } from 'react';

// Reusable component to display assignment details
// Used in both teacher and student dashboards
const AssignmentCard = ({ assignment, onDelete, isTeacher, user, onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);

  // Format date to readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if student already submitted this assignment
  const isSubmitted = assignment.submittedStudents?.some(
    s => s.studentId === user?._id
  );

  // Handle student submission
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(assignment._id, user._id, user.name);
    } catch (error) {
      console.error('Error submitting assignment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{assignment.title}</h3>
          <p className="text-sm text-indigo-600 font-semibold">{assignment.subject}</p>
        </div>
        {isTeacher && (
          <button
            onClick={() => onDelete(assignment._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-sm"
          >
            Delete
          </button>
        )}
      </div>

      <p className="text-gray-700 mb-4">{assignment.description}</p>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500 uppercase">Teacher</p>
          <p className="text-sm font-semibold text-gray-800">{assignment.teacherName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Deadline</p>
          <p className="text-sm font-semibold text-red-600">{formatDate(assignment.deadline)}</p>
        </div>
      </div>

      {/* Show submitted info for students */}
      {!isTeacher && assignment.submittedStudents && assignment.submittedStudents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase mb-2">Submitted by ({assignment.submittedStudents.length})</p>
          <div className="flex flex-wrap gap-2">
            {assignment.submittedStudents.map((student, idx) => (
              <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {student.studentName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Student submit button */}
      {!isTeacher && (
        <div className="mt-4">
          {isSubmitted ? (
            <button
              disabled
              className="w-full bg-green-500 text-white px-4 py-2 rounded transition text-sm font-semibold cursor-not-allowed"
            >
              ✓ Submitted
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : '📤 Submit Assignment'}
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">Posted: {formatDate(assignment.createdAt)}</p>
    </div>
  );
};

export default AssignmentCard;