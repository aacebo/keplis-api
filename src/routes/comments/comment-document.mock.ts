import * as uuid from 'uuid';
import * as faker from 'faker';

import { comment } from './comment.mock';
import { Comment } from './comment.entity';

export function commentDocument(args?: Partial<Comment>) {
  const value = comment({
    _id: uuid.v4(),
    ticket: uuid.v4(),
    comments: [],
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
