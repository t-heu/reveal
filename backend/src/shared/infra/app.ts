import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import 'express-async-errors';
import { isCelebrate } from 'celebrate';
import multer from 'multer';
import { Server } from 'http';
import socket from 'socket.io';

import './providers/MailProvider';

import v1Router from './http/api/v1';
import rateLimiter from './http/middlewares/rateLimiter';
import * as AppError from '../core/AppError';

dotenv.config();

const app = express();
const server = new Server(app);
export const io = socket(server);

let maintenance = false;
export const connectUsers: any = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  connectUsers[user] = socket.id;
  // console.log('PING PONG');
  // socket.on('count_notification_not_read', data => {
  //   if (data.clear) {
  //     console.log(data, ' ---');
  //   }
  // });
});

// SOCKET.IO
// app.use((req, res, next) => {
//   req.io = io;
//   // req.connectUsers = connectUsers;
//   return next();
// });
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
  (
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Response | void => {
    if (request.path === '/maintenance') {
      if (request.query.role && request.query.role === 'admin') {
        maintenance = request.query.check === 'true';
      }
    }

    if (maintenance) {
      return response.status(503).json({
        status: 'Maintenance',
        message: 'Will be back',
      });
    }

    return _next();
  },
);
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
