import * as joi from 'joi';

import { TicketLabel } from '../../../../ticket-label.enum';

export const LabelsTicketResponseSchema = joi.array().items(joi.object({
  label: joi.string().valid(...Object.values(TicketLabel)).required(),
  count: joi.number().min(0).required(),
  percentage: joi.number().min(0).max(100).required(),
}));
