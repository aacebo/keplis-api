import * as joi from 'joi';

import { TicketType } from '../../ticket-type.enum';

export class CreateTicketRequest {
  readonly type: TicketType;
  readonly title: string;
  readonly body: string;
}

export const CreateTicketRequestSchema = joi.object<CreateTicketRequest>({
  type: joi.string().valid(...Object.values(TicketType)).required(),
  title: joi.string().required(),
  body: joi.string().required(),
});
