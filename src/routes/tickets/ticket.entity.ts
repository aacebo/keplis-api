import * as mongoose from 'mongoose';
import * as sequence from 'mongoose-sequence';
import * as uuid from 'uuid';

import { TicketLabel } from './ticket-label.enum';
import { TicketStatus } from './ticket-status.enum';
import { TicketType } from './ticket-type.enum';

export class Ticket {
  readonly _id: string;
  readonly organization: string;
  readonly project: string;
  readonly comments: string[];
  readonly number: number;
  readonly type: TicketType;
  readonly labels: TicketLabel[];
  status: TicketStatus;
  title: string;
  body: string;
  readonly createdAt: Date;
  readonly createdBy: string;
  updatedAt?: Date;
  removedAt?: Date;

  constructor(args?: Partial<Ticket>) {
    Object.assign(this, args);
  }
}

export interface ITicketDocument extends Ticket, mongoose.Document {
  readonly _id: string;
}

export const TicketModel = mongoose.model<ITicketDocument>('Ticket', new mongoose.Schema<Ticket>({
  _id: { type: String, default: uuid.v4, required: true },
  organization: { type: String, ref: 'Organization', required: true },
  project: { type: String, ref: 'Project', required: true },
  comments: [{ type: String, ref: 'Comment' }],
  number: { type: Number, unique: true },
  type: { type: String, enum: Object.values(TicketType), required: true, index: true },
  status: { type: String, enum: Object.values(TicketStatus), default: TicketStatus.Open, required: true, index: true },
  labels: [{ type: String, enum: Object.values(TicketLabel), index: true }],
  title: { type: String, required: true, index: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  createdBy: { type: String, ref: 'User', required: true },
  updatedAt: { type: Date },
  removedAt: { type: Date },
}, {
  timestamps: true,
  versionKey: false,
}).plugin(
  sequence(mongoose),
  { inc_field: 'number' },
));
