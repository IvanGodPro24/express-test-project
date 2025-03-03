import mongoose from 'mongoose';
import { getAllStudents, getStudentById } from '../services/students.js';

export const getStudentsController = async (req, res) => {
  const students = await getAllStudents();

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};

export const getStudentByIdController = async (req, res, next) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: 'Invalid student ID Format' });
  }

  try {
    const student = await getStudentById(studentId);

    // if (!student) {
    //   res.status(404).json({
    //     message: 'Student not found!',
    //   });
    //   return;
    // }

    if (!student) {
      next(new Error('Student not found!'));
      return;
    }

    res.json({
      status: 200,
      message: `Successfully found student with id ${studentId}!`,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};
