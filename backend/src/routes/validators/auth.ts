import * as Joi from 'joi';

export const register:Joi.ObjectSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email({ minDomainAtoms: 2 }),
}).required();
