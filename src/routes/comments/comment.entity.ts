import * as mongoose from 'mongoose';
import * as uuid from 'uuid';

export class Comment {
  readonly _id: string;
  readonly ticket?: string;
  readonly comments: string[];
  title: string;
  body: string;
  readonly createdAt: Date;
  readonly createdBy: string;
  updatedAt?: Date;
  removedAt?: Date;

  constructor(args?: Partial<Comment>) {
    Object.assign(this, args);
  }
}

export interface ICommentDocument extends Comment, mongoose.Document {
  readonly _id: string;
}

export const CommentModel = mongoose.model<ICommentDocument>('Comment', new mongoose.Schema<Comment>({
  _id: { type: String, default: uuid.v4, required: true },
  ticket: { type: String, ref: 'Ticket' },
  comments: [{ type: String, ref: 'Comment' }],
  title: { type: String, required: true, index: true },
  body: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now, required: true },
  createdBy: { type: String, ref: 'User', required: true },
  updatedAt: { type: Date },
  removedAt: { type: Date },
}, {
  timestamps: true,
  versionKey: false,
}));
