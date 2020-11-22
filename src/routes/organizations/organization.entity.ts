import * as mongoose from 'mongoose';
import * as uuid from 'uuid';

import { NAME_REGEX } from '../../core/name';

export class Organization {
  readonly _id: string;
  readonly projects: string[];
  image?: string;
  name: string;
  displayName: string;
  description?: string;
  website?: string;
  email?: string;
  owners: string[];
  readonly createdAt: Date;
  readonly createdBy: string;
  updatedAt?: Date;
  removedAt?: Date;

  constructor(args?: Partial<Organization>) {
    Object.assign(this, args);
  }
}

export interface IOrganizationDocument extends Organization, mongoose.Document {
  readonly _id: string;
}

export const OrganizationModel = mongoose.model<IOrganizationDocument>('Organization', new mongoose.Schema<Organization>({
  _id: { type: String, default: uuid.v4, required: true },
  projects: [{ type: String, ref: 'Project' }],
  image: { type: String },
  name: { type: String, match: NAME_REGEX, unique: true, required: true, index: true },
  displayName: { type: String, required: true, index: true },
  description: { type: String },
  website: { type: String },
  email: { type: String },
  owners: [{ type: String, ref: 'User' }],
  createdAt: { type: Date, default: Date.now, required: true },
  createdBy: { type: String, ref: 'User', required: true },
  updatedAt: { type: Date },
  removedAt: { type: Date },
}, {
  timestamps: true,
  versionKey: false,
}));
