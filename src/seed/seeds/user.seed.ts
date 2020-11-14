import * as faker from 'faker';

import { parseName } from '../../core/name';
import { User } from '../../routes/users/user.entity';

export function user(args?: Partial<User>) {
  const firstName = args?.firstName || faker.name.firstName();
  const lastName = args?.lastName || faker.name.lastName();
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
