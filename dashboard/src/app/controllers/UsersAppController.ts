import {Request, Response} from 'express'

import data from './data.json';
import AppError from '../errors/AppError';
import {UserDTO} from '../models/User'

class UsersAppController {
  async index(req: Request, res: Response) {
    try {
      const user = req.user as UserDTO;
      
      if(user) {
        return res.render('users', { user, data });
      }

      return res.render('home', { user: null });
    } catch (e) {
      throw new AppError('Internal Server Error');
    }
  }
}

export default new UsersAppController()