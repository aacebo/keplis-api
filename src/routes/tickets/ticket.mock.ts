import * as faker from 'faker';

import { TicketType } from './ticket-type.enum';
import { TicketStatus } from './ticket-status.enum';
import { TicketLabel } from './ticket-label.enum';

import { Ticket } from './ticket.entity';

export function ticket(args?: Partial<Ticket>) {
  const types = Object.values(TicketType);
  const statuses = Object.values(TicketStatus);
  const labels = Object.values(TicketLabel);

  return {
    type: types[faker.random.number(types.length - 1)],
    status: statuses[faker.random.number(statuses.length - 1)],
    labels: [
      labels[faker.random.number(labels.length - 1)],
      labels[faker.random.number(labels.length - 1)],
      labels[faker.random.number(labels.length - 1)],
    ],
    title: faker.lorem.sentence(),
    body: faker.lorem.sentences(20),
    ...args,
  };
}
