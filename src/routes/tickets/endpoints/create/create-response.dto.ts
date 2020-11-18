import { UserJoinSchema } from '../../../users';

import { TicketSchema } from '../../ticket.schema';

export const CreateTicketResponseSchema = TicketSchema.append({
  createdBy: UserJoinSchema.required(),
});
