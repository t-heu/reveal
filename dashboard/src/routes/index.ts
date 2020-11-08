import {Router} from 'express'

import admins from './admins';
import usersApp from './usersApp';

const router = Router();

router.use(admins)
router.use('/app', usersApp)

export default router;