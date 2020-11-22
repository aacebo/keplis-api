import * as faker from 'faker';
import * as uuid from 'uuid';

import { ticket } from './ticket.mock';
import { Ticket } from './ticket.entity';

export function ticketDocument(args?: Partial<Ticket>) {
  const value = ticket({
    _id: uuid.v4(),
    comments: [],
    createdAt: faker.date.past(),
    ...args,
  });

  const toObject = () => value;

  return {
    ...value,
    toObject,
    save: () => Promise.resolve(value),
  };
}
