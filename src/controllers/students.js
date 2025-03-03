import mongoose from 'mongoose';
import { getAllStudents, getStudentById } from '../services/students.js';
import createHttpError from 'http-errors';

export const getStudentsController = async (req, res, next) => {
  const students = await getAllStudents();

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};

export const getStudentByIdController = async (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: 'Invalid student ID Format' });
  }

  const student = await getStudentById(studentId);

  // if (!student) {
  //   res.status(404).json({
  //     message: 'Student not found!',
  //   });
  //   return;
  // }

  //   if (!student) {
  //     next(new Error('Student not found!'));
  //     return;
  //   }

  if (!student) {
    // next(createHttpError(404, 'Student not found!'));
    // return;
    throw createHttpError(404, 'Student not found!');
  }

  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};
