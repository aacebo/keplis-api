import * as joi from 'joi';

import { TicketLabel } from './ticket-label.enum';
import { TicketStatus } from './ticket-status.enum';
import { TicketType } from './ticket-type.enum';
import { Ticket } from './ticket.entity';

export const TicketSchema = joi.object<Ticket>({
  _id: joi.string().uuid({ version: 'uuidv4' }).required(),
  organization: joi.string().uuid({ version: 'uuidv4' }).required(),
  project: joi.string().uuid({ version: 'uuidv4' }).required(),
  comments: joi.array().items(joi.string().uuid({ version: 'uuidv4' })).required(),
  number: joi.number().min(1).required(),
  type: joi.string().valid(...Object.values(TicketType)).required(),
  status: joi.string().valid(...Object.values(TicketStatus)).required(),
  labels: joi.array().items(joi.string().valid(...Object.values(TicketLabel))).unique().required(),
  title: joi.string().required(),
  body: joi.string().required(),
  createdAt: joi.date().required(),
  createdBy: joi.string().uuid({ version: 'uuidv4' }).required(),
  updatedAt: joi.date(),
  removedAt: joi.date(),
});
