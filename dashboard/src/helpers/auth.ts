import bcrypt from 'bcryptjs'
import {PassportStatic} from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'

import User, {UserDTO} from '../app/models/User'

export default function(passport: PassportStatic) {
  passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return done(null, false, {message: 'User not Found'})
      }
      
      if (!await bcrypt.compare(password, user.password)) {
        return done(null, false, {message: 'invalid password'})
      }

      return done(null, user) 
    } catch (e) {
      console.log(e)
      return done(null, false, {message: 'Internal Server Error'})
    }
  }))

  passport.serializeUser((userLogged: {_id: string}, cb) => {
    cb(null, userLogged._id);
  })

  passport.deserializeUser(async (id, cb) => {
    const user = {} as UserDTO;
    const userLogged = await User.findById(id);

    if (!userLogged) return

    user.name = userLogged.name
    // user.email = user.email
    user._id = userLogged._id
    user.role = userLogged.role

    cb(null, user);
  })
}