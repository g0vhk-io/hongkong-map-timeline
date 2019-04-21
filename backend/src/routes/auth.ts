import * as passport from 'passport';
import { asyncMiddleware } from '../utils/async_middleware';
import validator from '../controllers/validator';
import * as place from './validators/place';
import { Router } from 'restify-router';

import {
  passportAuthenicate,
} from '../utils/api_helper';

import * as authController from '../controllers/auth_controller';

const router = new Router();
router.post('/local', asyncMiddleware(authController.login));
router.post('/register', validator('/auth/register'), asyncMiddleware(authController.register));
router.get('/me', passport.authenticate('jwt'), asyncMiddleware(authController.me));
router.post('/facebook', passportAuthenicate('facebook'), asyncMiddleware(authController.facebookLogin));

export default router;
