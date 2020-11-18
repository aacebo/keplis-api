import * as faker from 'faker';
import * as uuid from 'uuid';

import { ticket } from '../../seed/seeds/ticket.seed';
import { Ticket } from '../../routes/tickets/ticket.entity';

export function ticketDocument(args?: Partial<Ticket>) {
  const value = ticket({
    _id: uuid.v4(),
    createdAt: faker.date.past(),
    ...args,
  });

  const toObject = () => value;

  return {
    ...toObject(),
    toObject,
    save: () => Promise.resolve(value),
  };
}
