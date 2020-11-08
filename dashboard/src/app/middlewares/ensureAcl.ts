import {Request, Response, NextFunction} from 'express'

import AppError from '../errors/AppError';
import {UserDTO} from '../models/User'

export default function ensureAcl(req: Request, res: Response, next: NextFunction) {
  const user = req.user as UserDTO;

  if(user.role != 'admin') {
    throw new AppError('Access Denied', 403);
  }
 
  return next()
}
