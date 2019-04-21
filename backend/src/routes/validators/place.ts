import * as Joi from 'joi';
import { PLACE_PROVIDER } from '../../common/common';
import { localizable, location } from './common';

export const create:Joi.ObjectSchema = Joi.object().keys({
  location,
  name: localizable.required(),
  description: localizable.optional(),
  address: localizable.optional(),
  year_from: Joi.number().optional(),
  year_to: Joi.number().optional(),
  provider: Joi.string().valid(PLACE_PROVIDER).required(),
  provider_id: Joi.string().when('provider', { is: 'manual', then: Joi.optional(), otherwise: Joi.required() }),
}).required();
