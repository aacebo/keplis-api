import { Response } from 'express';

import { IAuthRequest } from '../../../../../../core/auth';
import { IAggregate } from '../../../../../../core/aggregate';

import { TicketModel } from '../../../../ticket.entity';
import { TicketType } from '../../../../ticket-type.enum';

export async function types(_req: IAuthRequest, res: Response) {
  const total = await TicketModel.countDocuments({
    removedAt: { $eq: undefined },
  });

  const aggregate = await TicketModel.aggregate<IAggregate<TicketType>>([
    {
      $match: {
        removedAt: { $exists: false },
      },
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  res.send(aggregate.map(a => ({
    type: a._id,
    count: a.count,
    percentage: +((100 / total) * a.count).toFixed(2),
  })));
}
