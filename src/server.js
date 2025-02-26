import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const PORT = Number(process.env.PORT);

import { getEnvVar } from './utils/getEnvVar.js';
import { getAllStudents, getStudentById } from './services/students.js';
import mongoose from 'mongoose';

const PORT = Number(getEnvVar('PORT', '8080'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  app.get('/students', async (req, res) => {
    const students = await getAllStudents();

    res.status(200).json({
      data: students,
    });
  });

  app.get('/students/:studentId', async (req, res, next) => {
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

  app.use('*', (req, res, next) => {
    res.status(404).json({ message: 'Not Found!' });
  });

  app.use((err, req, res, next) => {
    res
      .status(500)
      .json({ message: 'Something went wrong!', error: err.message });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
