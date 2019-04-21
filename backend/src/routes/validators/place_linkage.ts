import * as Joi from 'joi';
import { PLACE_LINKAGE_TYPE } from '../../common/common';

export const create:Joi.ObjectSchema = Joi.object().keys({
  linkages: Joi.array().items(Joi.object().keys({
    type: Joi.string().allow(PLACE_LINKAGE_TYPE).required(),
    children: Joi.array().items(Joi.string()).required(),
    parents: Joi.array().items(Joi.string()).required(),
  })).required(),
}).required();
