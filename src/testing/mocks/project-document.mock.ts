import * as uuid from 'uuid';
import * as faker from 'faker';

import { project } from '../../seed/seeds/project.seed';
import { Project } from '../../routes';

export function projectDocument(args?: Partial<Project>) {
  const value = project({
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
  }
}
