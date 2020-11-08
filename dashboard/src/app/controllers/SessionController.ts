import {Request, Response} from 'express'

import AppError from '../errors/AppError';
import {UserDTO} from '../models/User'
import data from './data.json';

class SessionController {
  async index(req: Request, res: Response) {
    try {
      const user = req.user as UserDTO;
      
      if(user) {
        return res.render('home', { user, data });
      }

      return res.render('home', { user: null });
    } catch (e) {
      throw new AppError('Internal Server Error');
    }
  }
}

export default new SessionController()