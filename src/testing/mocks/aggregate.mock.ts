import * as faker from 'faker';

import { IAggregate } from '../../core/aggregate';

export function aggregate(values: string[]): IAggregate[] {
  const aggregate: IAggregate[] = [];

  for (const v of values) {
    aggregate.push({
      _id: v,
      count: faker.random.number(),
    });
  }

  return aggregate;
}
