import * as faker from 'faker';

import { parseName } from '../../core/name';

import { Organization } from './organization.entity';

export function organization(args?: Partial<Organization>) {
  const displayName = `${faker.company.companyName()} ${faker.random.alphaNumeric(5)}`;

  return {
    image: faker.internet.avatar(),
    name: parseName(displayName),
    displayName,
    description: faker.lorem.sentences(5),
    website: faker.internet.url(),
    email: faker.internet.email(),
    ...args,
  };
}
