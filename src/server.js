import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const PORT = Number(process.env.PORT);

import { getEnvVar } from './utils/getEnvVar.js';
import studentsRouter from './routes/students.js';

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

  app.use(studentsRouter);

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
