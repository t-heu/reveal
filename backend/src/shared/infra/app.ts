import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import 'express-async-errors';
import { isCelebrate } from 'celebrate';
import multer from 'multer';
import { Server } from 'http';

import './providers/MailProvider';

import Socket from './ws';
import v1Router from './http/api/v1';
import rateLimiter from './http/middlewares/rateLimiter';
import * as AppError from '../core/AppError';

dotenv.config();

const app = express();
const server = new Server(app);
Socket(server);

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
  next();
});
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);
app.use(morgan('combined')); // combined, dev
app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads')),
);
app.use('/api/v1', v1Router);
app.use(
  (
    err: any,
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Response => {
    if (isCelebrate(err)) {
      return response.status(404).json({
        status: 'error',
        message: err.joi.message,
      });
    }

    if (err instanceof AppError.AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    if (err instanceof multer.MulterError) {
      return response.status(400).json({
        status: 'error',
        message: err.message,
      });
    }

    console.log('[AppError]: Internal server error');
    console.error(err);

    return response.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred.',
    });
  },
);

const port = process.env.PORT || 3333;

server.listen(port);
console.log(`[App]: Listening on port ${port}`);
