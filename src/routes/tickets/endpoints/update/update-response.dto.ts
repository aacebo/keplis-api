import { UserJoinSchema } from '../../../users';

import { TicketSchema } from '../../ticket.schema';

export const UpdateTicketResponseSchema = TicketSchema.append({
  createdBy: UserJoinSchema.required(),
});
