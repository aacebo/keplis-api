import * as faker from 'faker';
import * as uuid from 'uuid';

import { token } from './token.mock';

const methods = ['GET', 'PUT', 'POST', 'DELETE'];

export function request(args?: any) {
  return {
    header: (_header: string) => token(),
    user: {
      id: uuid.v4(),
      email: faker.internet.email(),
    },
    pagination: { },
    originalUrl: faker.internet.url(),
    method: methods[faker.random.number({
      min: 0,
      max: 3,
    })],
    ...args,
  };
}
