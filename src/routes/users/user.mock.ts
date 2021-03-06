import * as faker from 'faker';

import { parseName } from '../../core/name';

import { User } from './user.entity';

export function user(args?: Partial<User>) {
  const firstName = args?.firstName || `${faker.name.firstName()}${faker.random.alphaNumeric(5)}`;
  const lastName = args?.lastName || `${faker.name.lastName()}${faker.random.alphaNumeric(5)}`;
  const username = args?.username || faker.internet.userName(firstName, lastName);

  return {
    image: faker.internet.avatar(),
    firstName,
    lastName,
    username: parseName(username),
    dob: faker.date.past(),
    email: faker.internet.email(firstName, lastName),
    ...args,
  };
}
