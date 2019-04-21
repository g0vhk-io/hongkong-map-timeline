import * as Joi from 'joi';

export const localizable = Joi.object().keys({
  en_us: Joi.string(),
  zh_hk: Joi.string(),
}).min(1).required();

export const location = Joi.object().keys({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
}).required();
