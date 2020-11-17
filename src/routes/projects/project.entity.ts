import * as mongoose from 'mongoose';
import * as uuid from 'uuid';

import { NAME_REGEX } from '../../core/name';

export class Project {
  readonly _id: string;
  name: string;
  displayName: string;
  description?: string;
  readonly createdAt: Date;
  readonly createdBy: string;
  updatedAt?: Date;
  removedAt?: Date;

  constructor(args?: Partial<Project>) {
    Object.assign(this, args);
  }
}

export interface IProjectDocument extends Project, mongoose.Document {
  readonly _id: string;
}

export const ProjectModel = mongoose.model<IProjectDocument>('Project', new mongoose.Schema<Project>({
  _id: { type: String, default: uuid.v4, required: true },
  name: { type: String, unique: true, match: NAME_REGEX, required: true, index: true },
  displayName: { type: String, required: true, index: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now, required: true },
  createdBy: { type: String, ref: 'User', required: true },
  updatedAt: { type: Date },
  removedAt: { type: Date },
}, {
  timestamps: true,
  versionKey: false,
}));
