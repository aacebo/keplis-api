import * as joi from 'joi';

import { TicketStatus } from '../../ticket-status.enum';

export class UpdateTicketRequest {
  readonly status?: TicketStatus
  readonly title?: string;
  readonly body?: string;
}

export const UpdateTicketRequestSchema = joi.object<UpdateTicketRequest>({
  status: joi.string().valid(...Object.values(TicketStatus)),
  title: joi.string(),
  body: joi.string(),
});
