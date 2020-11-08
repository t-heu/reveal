import express from 'express'
import passport from 'passport';

import UserController from '../app/controllers/UserController'
import SessionController from '../app/controllers/SessionController'

import ensureAuthenticated from '../app/middlewares/ensureAuthenticated'
import ensureAcl from '../app/middlewares/ensureAcl'

const router = express.Router();

router.post('/', UserController.store);
router.get('/', SessionController.index);
router.get('/user', ensureAuthenticated, ensureAcl, UserController.index);
router.post('/update/user/:id', ensureAuthenticated, ensureAcl, UserController.update);
router.post('/delete/user/:id', ensureAuthenticated, ensureAcl, UserController.delete);

router.post('/session', async (req, res, next) => {
  return passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/',
    failureFlash : true // allow flash messages
  })(req, res, next)
});

router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  return res.redirect('/');
});

export default router;