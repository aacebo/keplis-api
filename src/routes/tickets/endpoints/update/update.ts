import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { TicketModel } from '../../ticket.entity';

import { UpdateTicketRequest } from './update-request.dto';

export async function update(req: IAuthRequest<any, any, UpdateTicketRequest>, res: Response) {
  let ticket = await TicketModel.findOne({
    number: +req.params.ticketNumber,
  });

  if (!ticket) {
    res.status(StatusCodes.NOT_FOUND).send(`Ticket ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  if (ticket.createdBy !== req.user.id) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Update A Ticket You Didn\'t Create');
    return;
  }

  ticket = Object.assign(ticket, req.body);
  const saved = await ticket.save();
  const populated = await saved.populate('createdBy', '_id image username email').execPopulate();

  res.send(populated.toObject());
}
