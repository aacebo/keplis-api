import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Uploader } from '../../uploader';

const uploader = new Uploader('uploads');

export async function findOne(req: Request, res: Response) {
  try {
    uploader.download(req.params.fileId).pipe(res);
  } catch (e) {
    /* istanbul ignore next */
    res.status(StatusCodes.NOT_FOUND).end();
  }
}
