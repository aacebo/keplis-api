import { Response } from 'express';

import { IAuthRequest } from '../../../../../../core/auth';
import { IAggregate } from '../../../../../../core/aggregate';

import { TicketModel } from '../../../../ticket.entity';
import { TicketLabel } from '../../../../ticket-label.enum';

export async function labels(_req: IAuthRequest, res: Response) {
  const total = await TicketModel.countDocuments({
    removedAt: { $eq: undefined },
  });

  const aggregate = await TicketModel.aggregate<IAggregate<TicketLabel>>([
    {
      $match: {
        removedAt: { $exists: false },
      },
    },
    { $unwind: '$labels' },
    {
      $group: {
        _id: '$labels',
        count: { $sum: 1 },
      },
    },
  ]);

  res.send(aggregate.map(a => ({
    label: a._id,
    count: a.count,
    percentage: +((100 / total) * a.count).toFixed(2),
  })));
}
