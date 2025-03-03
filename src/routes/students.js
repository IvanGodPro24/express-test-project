import { Router } from 'express';
import mongoose from 'mongoose';
import { getAllStudents, getStudentById } from '../services/students.js';

const router = Router();

router.get('/students', async (req, res) => {
  const students = await getAllStudents();

  res.status(200).json({
    data: students,
  });
});

router.get('/students/:studentId', async (req, res, next) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: 'Invalid student ID Format' });
  }

  try {
    const student = await getStudentById(studentId);

    if (!student) {
      res.status(404).json({
        message: 'Student not found!',
      });
      return;
    }

    res.status(200).json({
      data: student,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
