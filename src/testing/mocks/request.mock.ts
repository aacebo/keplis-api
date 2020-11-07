import * as faker from 'faker';

import { token } from './token.mock';

const methods = ['GET', 'PUT', 'POST', 'DELETE'];

export function request(args?: any) {
  return {
    header: (_header: string) => token(),
    user: { email: faker.internet.email() },
    pagination: { },
    originalUrl: faker.internet.url(),
    method: methods[faker.random.number({
      min: 0,
      max: 3,
    })],
    ...args,
  };
}
