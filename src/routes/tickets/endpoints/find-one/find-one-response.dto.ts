import { UserJoinSchema } from '../../../users';

import { TicketSchema } from '../../ticket.schema';

export const FindOneTicketResponseSchema = TicketSchema.append({
  createdBy: UserJoinSchema.required(),
});
