import * as joi from 'joi';

import { TicketType } from '../../../../ticket-type.enum';

export const TypesTicketResponseSchema = joi.array().items(joi.object({
  type: joi.string().valid(...Object.values(TicketType)).required(),
  count: joi.number().min(0).required(),
  percentage: joi.number().min(0).max(100).required(),
}));
