import * as faker from 'faker';

import { parseName } from '../../core/name';
import { Project } from '../../routes/organizations/routes/projects/project.entity';

export function project(args?: Partial<Project>) {
  const displayName = `${faker.random.alphaNumeric(10)}`;

  return {
    name: parseName(displayName),
    displayName,
    description: faker.lorem.sentences(5),
    ...args,
  };
}
