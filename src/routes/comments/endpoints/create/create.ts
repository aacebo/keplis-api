import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { TicketModel } from '../../../tickets/ticket.entity';

import { CommentModel } from '../../comment.entity';

import { CreateCommentRequest } from './create-request.dto';

export async function create(req: IAuthRequest<any, any, CreateCommentRequest>, res: Response) {
  const ticket = await TicketModel.findOne({
    number: +req.params.ticketNumber,
  });

  if (!ticket) {
    res.status(StatusCodes.NOT_FOUND).send(`Ticket ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const comment = new CommentModel({
    ...req.body,
    ticket: ticket._id,
    createdBy: req.user.id,
  }).populate('createdBy', '_id image username email')
    .populate('likes', '_id username');

  await comment.save();
  const saved = await comment.execPopulate();

  ticket.comments.push(saved._id);
  await ticket.save();

  res.status(StatusCodes.CREATED).send(saved.toObject());
}
