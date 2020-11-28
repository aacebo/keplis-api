import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../../../../../core/auth';
import { IAggregate } from '../../../../../../../../core/aggregate';

import { TicketModel } from '../../../../../../../tickets/ticket.entity';
import { TicketLabel } from '../../../../../../../tickets/ticket-label.enum';

import { ProjectModel } from '../../../../../../project.entity';

export async function labels(req: IAuthRequest, res: Response) {
  const project = await ProjectModel.findOne({ name: req.params.projectName });

  if (!project) {
    res.status(StatusCodes.NOT_FOUND).send(`Project ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const total = await TicketModel.countDocuments({
    removedAt: { $eq: undefined },
    project: { $eq: project._id },
  });

  const aggregate = await TicketModel.aggregate<IAggregate<TicketLabel>>([
    {
      $match: {
        removedAt: { $exists: false },
        project: { $eq: project._id },
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
