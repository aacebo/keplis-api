import * as faker from 'faker';
import * as uuid from 'uuid';

export function userDocument(args?: any) {
  const _id = uuid.v4();
  const firstName = args?.firstName || faker.name.firstName();
  const lastName = args?.lastName || faker.name.lastName();
  const username = faker.internet.userName(firstName, lastName);
  const dob = faker.date.past();
  const email = faker.internet.email();
  const image = faker.internet.avatar();

  const toObject = () => {
    return {
      _id,
      firstName,
      lastName,
      username,
      dob,
      email,
      image,
      ...args,
    };
  }

  return {
    ...toObject(),
    toObject,
    save: () => Promise.resolve({ _id }),
  };
}
