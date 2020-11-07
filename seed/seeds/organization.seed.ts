import * as faker from 'faker';

import { Organization } from '../../src/routes/organizations';

export function organization(args?: Partial<Organization>) {
  const displayName = faker.company.companyName();

  return {
    image: faker.internet.avatar(),
    private: faker.random.boolean(),
    name: displayName.toLowerCase().replace(/-+/g, '').replace(/[\s,]+/g, '-'),
    displayName,
    description: faker.lorem.sentences(5),
    website: faker.internet.url(),
    email: faker.internet.email(),
    ...args,
  };
}
