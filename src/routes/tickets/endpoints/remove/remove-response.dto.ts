import { UserJoinSchema } from '../../../users';

import { TicketSchema } from '../../ticket.schema';

export const RemoveTicketResponseSchema = TicketSchema.append({
  createdBy: UserJoinSchema.required(),
});
