import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function create(req: Request, res: Response) {
  res.status(StatusCodes.CREATED).send({
    url: `${req.protocol}://${req.get('host')}/files/${req.file.id}`,
  });
}
