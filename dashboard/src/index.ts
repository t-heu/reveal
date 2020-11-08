import dotenv from 'dotenv'
dotenv.config()

import path from 'path';
import express, {Request, Response, NextFunction} from "express";
import passport from 'passport';
import mongoose from 'mongoose'
import flash from 'connect-flash'
import helmet from 'helmet';
import morgan from 'morgan'
import session from 'express-session'
import 'express-async-errors'

import routes from './routes'
import auth from './helpers/auth'
import AppError from './app/errors/AppError'
auth(passport);

const { SESSION_SECRET, MONGO_URL } =  process.env;
const app = express();

mongoose.connect(MONGO_URL as string,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(morgan('combined'))
app.use(flash());
app.use(helmet());
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET as string, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})
app.use(routes);
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    // erro conhecido pela aplicação
    request.flash('error', err.message)
    return response.redirect('/');
  }
  console.log(err);
  request.flash('error', '500 Internal Server Error')
  return response.redirect('/');
});

app.listen(process.env.PORT || 3000);
console.log('🚀 run')