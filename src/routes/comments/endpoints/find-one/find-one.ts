import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { CommentModel } from '../../comment.entity';

export async function findOne(req: Request, res: Response) {
  const comment = await CommentModel.findOne({
    _id: req.params.commentId,
  }).populate('createdBy', '_id image username email')
    .populate('likes', '_id username');

  if (!comment) {
    res.status(StatusCodes.NOT_FOUND).send(`Comment ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  res.send(comment.toObject());
}
