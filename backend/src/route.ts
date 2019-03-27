import * as passport from 'passport';
import { asyncMiddleware } from './async_middleware';
import { validate } from './controllers/validator';

import {
  passportAuthenicate,
} from './utils/api_helper';

// controllers
import * as authController from './controllers/auth_controller';
import * as placeController from './controllers/place_controller';

export const route = (server) => {
  // auth
  server.post('/auth/local', asyncMiddleware(authController.login));
  server.post('/auth/register', validate('/auth/register'), asyncMiddleware(authController.register));
  server.get('/me', passport.authenticate('jwt'), asyncMiddleware(authController.me));
  server.post('/auth/facebook', passportAuthenicate('facebook'), asyncMiddleware(authController.facebookLogin));

  // place
  server.post('/place', validate('/place'), asyncMiddleware(placeController.create));
  server.get('/place', asyncMiddleware(placeController.list));
  server.get('/place/:id', asyncMiddleware(placeController.get));

};
