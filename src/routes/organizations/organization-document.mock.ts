import * as uuid from 'uuid';
import * as faker from 'faker';

import { organization } from './organization.mock';
import { Organization } from './organization.entity';

export function organizationDocument(args?: Partial<Organization>) {
  const value = organization({
    _id: uuid.v4(),
    createdBy: uuid.v4(),
    createdAt: faker.date.past(),
    owners: [],
    ...args,
  });

  const toObject = () => value;

  return {
    ...value,
    toObject,
    save: () => Promise.resolve(value),
  };
}
