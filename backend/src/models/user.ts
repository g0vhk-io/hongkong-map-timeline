import { Document, Schema, Model, model } from 'mongoose';
import * as PromiseBluebird from 'bluebird';
import { jsonTransform } from './../utils/model_helper';
const bcrypt = PromiseBluebird.promisifyAll(require('bcrypt'));

const UserSchema = new Schema(
  {
    username: { type: String },
    password_hash: String,
    facebook_id: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: jsonTransform(['password_hash']),
    },
  });

// Index for username
UserSchema.index(
  {
    username: 1,
    facebook_id: 1,
  },
  { unique: true },
);

UserSchema.methods.verifyPassword = async function verifyPassword(hash: string) {
  return bcrypt.compareAsync(hash, this.password_hash);
};

UserSchema.statics.hashPassword = async function hashPassword(password) {
  return bcrypt.hashAsync(password, 14);
};

/**
 * Public interface for user model
 */
export interface IUser {
  username?: string;
  mobile?: string;
  facebook_id?: string;
}

/**
 * Describing the document returned from mongo
 */
export interface IUserDocument extends IUser, Document {
  verifyPassword(hash: string): boolean;
}

export interface IUserModel extends Model<IUserDocument> {
  // define static methods here
  hashPassword(passowrd: string): string;
}

export const User: IUserModel = model<IUserDocument, IUserModel>('User', UserSchema);
