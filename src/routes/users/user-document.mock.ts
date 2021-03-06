import * as faker from 'faker';
import * as uuid from 'uuid';

import { user } from './user.mock';
import { User } from './user.entity';

export function userDocument(args?: Partial<User>) {
  const value = user({
    _id: uuid.v4(),
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
