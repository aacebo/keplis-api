import * as mongoose from 'mongoose';
import * as uuid from 'uuid';

import { NAME_REGEX } from '../../core/name';

import { UserOrigin } from './user-origin.enum';

export class User {
  readonly _id: string;
  readonly origin?: UserOrigin;
  image?: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  readonly createdAt: Date;
  updatedAt?: Date;
  removedAt?: Date;

  constructor(args?: Partial<User>) {
    Object.assign(this, args);
  }
}

export interface IUserDocument extends User, mongoose.Document {
  readonly _id: string;
}

export const UserModel = mongoose.model<IUserDocument>('User', new mongoose.Schema<User>({
  _id: { type: String, default: uuid.v4, required: true },
  origin: { type: String, enum: Object.values(UserOrigin) },
  image: { type: String },
  username: { type: String, match: NAME_REGEX, required: true, unique: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date },
  removedAt: { type: Date },
}, {
  timestamps: true,
  versionKey: false,
}));
