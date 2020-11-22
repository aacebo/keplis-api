import * as faker from 'faker';

import { Comment } from './comment.entity';

export function comment(args?: Partial<Comment>) {
  return {
    body: faker.lorem.sentences(5),
    ...args,
  };
}
