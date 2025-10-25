const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// POST - Teacher creates a new assignment
router.post('/', async (req, res) => {
  try {
    const { title, description, subject, deadline, teacherId, teacherName } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !subject || !deadline || !teacherId || !teacherName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create assignment object
    const newAssignment = new Assignment({
      title,
      description,
      subject,
      deadline: new Date(deadline),
      teacherId,
      teacherName
    });

    // Save to database
    await newAssignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating assignment', error: error.message });
  }
});

// GET - Fetch all assignments (for students)
router.get('/', async (req, res) => {
  try {
    // Get all assignments sorted by newest first
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
});

// GET - Fetch assignments by specific teacher
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const assignments = await Assignment.find({ teacherId }).sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
});

// DELETE - Remove an assignment
router.delete('/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    await Assignment.findByIdAndDelete(assignmentId);
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
});

// POST - Student submits/completes an assignment
router.post('/:assignmentId/submit', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { studentId, studentName } = req.body;

    // Check if required fields are provided
    if (!studentId || !studentName) {
      return res.status(400).json({ message: 'Student ID and name are required' });
    }

    // Find assignment and check if student already submitted
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student already submitted
    const alreadySubmitted = assignment.submittedStudents.some(
      s => s.studentId.toString() === studentId.toString()
    );

    if (alreadySubmitted) {
      return res.status(400).json({ message: 'You have already submitted this assignment' });
    }

    // Add student to submittedStudents array
    assignment.submittedStudents.push({
      studentId,
      studentName,
      submittedAt: new Date()
    });

    await assignment.save();
    res.status(200).json({ message: 'Assignment submitted successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assignment', error: error.message });
  }
});

module.exports = router;