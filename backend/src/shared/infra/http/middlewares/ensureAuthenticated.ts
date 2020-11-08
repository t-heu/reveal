import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import * as authConfig from '../../../../config/auth';
import { AppError } from '../../../core/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.ACCESS_TOKEN_SECRET);

    const { sub } = decoded as TokenPayload;
    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    // console.log(err);
    throw new AppError(err.message || 'Invalid JWT token', 401);
  }
}
