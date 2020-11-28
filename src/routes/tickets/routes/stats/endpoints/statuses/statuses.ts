import { Response } from 'express';

import { IAuthRequest } from '../../../../../../core/auth';
import { IAggregate } from '../../../../../../core/aggregate';

import { TicketModel } from '../../../../ticket.entity';
import { TicketStatus } from '../../../../ticket-status.enum';

export async function statuses(_req: IAuthRequest, res: Response) {
  const total = await TicketModel.countDocuments({
    removedAt: { $eq: undefined },
  });

  const aggregate = await TicketModel.aggregate<IAggregate<TicketStatus>>([
    {
      $match: {
        removedAt: { $exists: false },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  res.send(aggregate.map(a => ({
    status: a._id,
    count: a.count,
    percentage: +((100 / total) * a.count).toFixed(2),
  })));
}
