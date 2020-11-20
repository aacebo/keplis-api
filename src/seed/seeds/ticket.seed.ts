import * as faker from 'faker';

import { TicketType, Ticket, TicketStatus } from '../../routes/tickets';

export function ticket(args?: Partial<Ticket>) {
  const types = Object.values(TicketType);
  const statuses = Object.values(TicketStatus);

  return {
    number: faker.random.number({ min: 1 }),
    type: types[faker.random.number(types.length - 1)],
    status: statuses[faker.random.number(statuses.length - 1)],
    title: faker.lorem.sentence(),
    body: faker.lorem.sentences(20),
    ...args,
  };
}
