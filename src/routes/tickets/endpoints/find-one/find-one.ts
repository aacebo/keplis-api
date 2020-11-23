import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { TicketModel } from '../../ticket.entity';

export async function findOne(req: Request, res: Response) {
  const ticket = await TicketModel.findOne({
    number: +req.params.ticketNumber,
  }).populate('createdBy', '_id image username email');

  if (!ticket) {
    res.status(StatusCodes.NOT_FOUND).send(`Ticket ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  res.send(ticket.toObject());
}
