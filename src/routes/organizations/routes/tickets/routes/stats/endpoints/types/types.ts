import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../../../../../core/auth';
import { IAggregate } from '../../../../../../../../core/aggregate';

import { TicketModel } from '../../../../../../../tickets/ticket.entity';
import { TicketType } from '../../../../../../../tickets/ticket-type.enum';

import { OrganizationModel } from '../../../../../../organization.entity';

export async function types(req: IAuthRequest, res: Response) {
  const organization = await OrganizationModel.findOne({ name: req.params.orgName });

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const total = await TicketModel.countDocuments({
    removedAt: { $eq: undefined },
    organization: { $eq: organization._id },
  });

  const aggregate = await TicketModel.aggregate<IAggregate<TicketType>>([
    {
      $match: {
        removedAt: { $exists: false },
        organization: { $eq: organization._id },
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
