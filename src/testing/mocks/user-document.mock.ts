import * as faker from 'faker';
import * as uuid from 'uuid';

import { user } from '../../seed/seeds/user.seed';
import { User } from '../../routes';

export function userDocument(args?: Partial<User>) {
  const value = user({
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
