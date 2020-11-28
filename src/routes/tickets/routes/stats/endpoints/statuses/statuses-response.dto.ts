import * as joi from 'joi';

import { TicketStatus } from '../../../../ticket-status.enum';

export const StatusesTicketResponseSchema = joi.array().items(joi.object({
  status: joi.string().valid(...Object.values(TicketStatus)).required(),
  count: joi.number().min(0).required(),
  percentage: joi.number().min(0).max(100).required(),
}));
