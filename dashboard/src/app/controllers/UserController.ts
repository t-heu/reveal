import bcrypt from 'bcryptjs'
import {Request, Response} from 'express'

import AppError from '../errors/AppError';
import User, {UserDTO} from '../models/User'

class UserController {
  async index(req: Request, res: Response) {
    const user = req.user as UserDTO;

    const users = await User.find()
    const total = await User.find().count()

    return res.render('admin', { user, users, total });
  }

  async store(req: Request, res: Response) {
    const {email, password, roles, name} = req.body;

    if(!email || !password) {
      throw new AppError('Fields are empty');
    }

    const userExist = await User.findOne({ email })
        
    if(userExist) {
      throw new AppError('User already exists');
    }

    await User.create({
      email,
      password: await bcrypt.hash(password, 8),
      name,
      role: roles
    })
    req.flash('success', 'create')

    return res.redirect('/');
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const {password, roles, name, email} = req.body
    const data = {} as UserDTO

    if (password) data.password = await bcrypt.hash(password, 8)
    if (roles) data.role = roles
    if (name) data.name = name
    if (email) data.email = email

    await User.findByIdAndUpdate(id, data, {new: true})
    req.flash('success', 'Updated successfully')

    return res.redirect('/');
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await User.findByIdAndRemove(id)
      req.flash('success', 'Deleted successfully')

      return res.redirect('/');
    } catch (err) {
      throw new AppError('Error deleting user');
    }
  }
}

export default new UserController()