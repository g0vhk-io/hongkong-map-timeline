import { Router } from 'restify-router';
import authRouter from './auth';
import placeRouter from './place';

export const route = (server) => {
  const router:Router = new Router();
  router.add('/auth', authRouter);
  router.add('/place', placeRouter);
  router.applyRoutes(server);
};
