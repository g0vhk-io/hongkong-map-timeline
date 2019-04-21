import { Document, Schema, Model, model } from 'mongoose';
import * as PromiseBluebird from 'bluebird';
import { jsonTransform } from './../utils/model_helper';
import { Localizable, ILocalizable } from './localizable';

const bcrypt = PromiseBluebird.promisifyAll(require('bcrypt'));

export const TagSchema = new Schema(
  {
    name: Localizable({ index: true }),
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: jsonTransform([]),
    },
  });

  /**
* Public interface for user model
*/
export interface ITag {
  name?: ILocalizable;
}

export interface ITagDocument extends ITag, Document {
}

export const Tag: Model<ITagDocument> = model<ITagDocument>('Tag', TagSchema);
