import * as uuid from 'uuid';
import * as faker from 'faker';

import { project } from './project.mock';
import { Project } from './project.entity';

export function projectDocument(args?: Partial<Project>) {
  const value = project({
    _id: uuid.v4(),
    organization: uuid.v4(),
    tickets: [],
    createdBy: uuid.v4(),
    createdAt: faker.date.past(),
    ...args,
  });

  const toObject = () => value;

  return {
    ...value,
    toObject,
    save: () => Promise.resolve(value),
  }
}
