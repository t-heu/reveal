import {Request, Response, NextFunction} from 'express'

import AppError from '../errors/AppError';

export default function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if(req.isAuthenticated()) {
    return next()
  }
 
  throw new AppError('you not loggin', 401);
}
