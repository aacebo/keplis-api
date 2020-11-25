import { UserJoinSchema } from '../../../../../users/user.schema';
import { TicketSchema } from '../../../../../tickets/ticket.schema';

export const CreateTicketResponseSchema = TicketSchema.append({
  createdBy: UserJoinSchema.required(),
});
