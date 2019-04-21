import { BadRequestError } from './../utils/api_error';
import * as Joi from 'joi';
import * as restify from 'restify';

export default function validator(schema) {
  return (req: restify.Request, res: restify.Response, next: restify.Next) => {
    const { error } = Joi.validate(req.body, schema);
    if (error) {

      return next(BadRequestError(error.message));
    }
    next();
  };
}
