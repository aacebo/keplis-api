import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IPaginationRequest } from '../../../../../../core/pagination';

import { TicketModel, ITicketDocument, Ticket } from '../../../../../tickets/ticket.entity';

import { UserModel } from '../../../../user.entity';

export async function find(req: IPaginationRequest, res: Response) {
  const user = await UserModel.findOne({ username: req.params.username });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).send(`User ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const conditions: MongooseFilterQuery<Pick<ITicketDocument, keyof ITicketDocument>> = {
    title: { $regex: req.pagination.filter, $options: 'i' },
    createdBy: user._id,
    removedAt: { $eq: undefined },
  };

  const [tickets, total] = await Promise.all([
    TicketModel.find(conditions)
      .sort(req.pagination.sort.join(' '))
      .skip(req.pagination.skip)
      .limit(req.pagination.perPage)
      .populate('createdBy', '_id image username email'),
    TicketModel.countDocuments(conditions),
  ]);

  req.total = total;
  res.send(tickets.map(t => t.toObject()).map((t: Ticket) => ({
    ...t,
    comments: t.comments.length,
  })));
}
