import * as joi from 'joi';

import { UserJoinSchema } from '../../../../../users/user.schema';

import { TicketSchema } from '../../../../ticket.schema';

export const FindTicketResponseSchema = joi.array().items(TicketSchema.append({
  comments: joi.number().min(0).required(),
  createdBy: UserJoinSchema.required(),
}));
