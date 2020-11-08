import {Router} from 'express'

import UsersAppController from '../app/controllers/UsersAppController'

import ensureAuthenticated from '../app/middlewares/ensureAuthenticated'

const router = Router();

router.get('/user', ensureAuthenticated, UsersAppController.index);

export default router;