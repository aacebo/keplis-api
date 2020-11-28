import * as joi from 'joi';

import { TicketLabel } from '../../../../../tickets/ticket-label.enum';
import { TicketType } from '../../../../../tickets/ticket-type.enum';

export class CreateTicketRequest {
  readonly type: TicketType;
  readonly labels: TicketLabel[];
  readonly title: string;
  readonly body: string;
}

export const CreateTicketRequestSchema = joi.object<CreateTicketRequest>({
  type: joi.string().valid(...Object.values(TicketType)).required(),
  labels: joi.array().items(joi.string().valid(...Object.values(TicketLabel))).unique().default([]),
  title: joi.string().required(),
  body: joi.string().required(),
});
