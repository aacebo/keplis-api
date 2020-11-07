import * as uuid from 'uuid';
import * as faker from 'faker';

import { organization } from '../../../seed/seeds/organization.seed';
import { Organization } from '../../routes';

export function organizationDocument(args?: Partial<Organization>) {
  const value = organization({
    _id: uuid.v4(),
    createdBy: uuid.v4(),
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
