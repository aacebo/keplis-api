import * as joi from 'joi';

import { TicketLabel } from '../../ticket-label.enum';
import { TicketStatus } from '../../ticket-status.enum';

export class UpdateTicketRequest {
  readonly status?: TicketStatus;
  readonly labels?: TicketLabel[];
  readonly title?: string;
  readonly body?: string;
}

export const UpdateTicketRequestSchema = joi.object<UpdateTicketRequest>({
  status: joi.string().valid(...Object.values(TicketStatus)),
  labels: joi.array().items(joi.string().valid(...Object.values(TicketLabel))).unique(),
  title: joi.string(),
  body: joi.string(),
});
