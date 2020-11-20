import * as joi from 'joi';

import { TicketStatus } from './ticket-status.enum';
import { TicketType } from './ticket-type.enum';
import { Ticket } from './ticket.entity';

export const TicketSchema = joi.object<Ticket>({
  _id: joi.string().uuid({ version: 'uuidv4' }).required(),
  project: joi.string().uuid({ version: 'uuidv4' }).required(),
  number: joi.number().min(1).required(),
  type: joi.string().valid(...Object.values(TicketType)).required(),
  status: joi.string().valid(...Object.values(TicketStatus)).required(),
  title: joi.string().required(),
  body: joi.string().required(),
  createdAt: joi.date().required(),
  createdBy: joi.string().uuid({ version: 'uuidv4' }).required(),
  updatedAt: joi.date(),
  removedAt: joi.date(),
});
