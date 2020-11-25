import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IPaginationRequest } from '../../../../../../core/pagination';

import { CommentModel, Comment, ICommentDocument } from '../../../../../comments/comment.entity';

import { TicketModel } from '../../../../ticket.entity';

export async function find(req: IPaginationRequest, res: Response) {
  const ticket = await TicketModel.findOne({
    number: +req.params.ticketNumber,
  });

  if (!ticket) {
    res.status(StatusCodes.NOT_FOUND).send(`Ticket ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const conditions: MongooseFilterQuery<Pick<ICommentDocument, keyof ICommentDocument>> = {
    body: { $regex: req.pagination.filter, $options: 'i' },
    ticket: ticket._id,
    removedAt: { $eq: undefined },
  };

  const [comments, total] = await Promise.all([
    CommentModel.find(conditions)
      .sort(req.pagination.sort.join(' '))
      .skip(req.pagination.skip)
      .limit(req.pagination.perPage)
      .populate('createdBy', '_id image username email')
      .populate('likes', '_id username'),
    CommentModel.countDocuments(conditions),
  ]);

  req.total = total;
  res.send(comments.map(c => c.toObject()).map((c: Comment) => ({
    ...c,
    comments: c.comments.length,
  })));
}
