/**
 * Created by Nandi Wong on 29/11/2017.
 */

import { EntityAlreadyExists, InternalError } from './api_error';
import logger from './logger';

export const asyncMiddleware = fn => (req, res, next) => {
  // Catch all the error
  Promise.resolve(fn(req, res, next))
    .catch((err) => {
      logger.error(err.stack);
      if (err.code === 11000) {
        return next(EntityAlreadyExists());
      }
      return next(InternalError(err));
    });
};
