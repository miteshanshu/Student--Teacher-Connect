const mongoose = require('mongoose');

// Assignment model - stores assignments posted by teachers
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true  // Used for filtering
  },
  deadline: {
    type: Date,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  submittedStudents: [
    {
      studentId: mongoose.Schema.Types.ObjectId,
      studentName: String,
      submittedAt: Date
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema);