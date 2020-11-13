import * as faker from 'faker';

import { User } from '../../routes/users/user.entity';

export function user(args?: Partial<User>) {
  const firstName = args?.firstName || faker.name.firstName();
  const lastName = args?.lastName || faker.name.lastName();

  return {
    image: faker.internet.avatar(),
    firstName,
    lastName,
    username: faker.internet.userName(firstName, lastName),
    dob: faker.date.past(),
    email: faker.internet.email(firstName, lastName),
    ...args,
  };
}
