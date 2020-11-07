import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';

export function token(id?: string) {
  return jwt.sign({
    id: id || uuid.v4(),
    email: faker.internet.email(),
  }, process.env.SECRET);
}
