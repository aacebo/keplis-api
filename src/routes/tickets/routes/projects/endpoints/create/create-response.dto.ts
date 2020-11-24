import { UserJoinSchema } from '../../../../../users/user.schema';

import { TicketSchema } from '../../../../ticket.schema';

export const CreateTicketResponseSchema = TicketSchema.append({
  createdBy: UserJoinSchema.required(),
});
