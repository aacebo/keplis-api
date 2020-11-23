import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { CommentModel } from '../../comment.entity';

import { UpdateCommentRequest } from './update-request.dto';

export async function update(req: IAuthRequest<any, any, UpdateCommentRequest>, res: Response) {
  let comment = await CommentModel.findOne({
    _id: req.params.commentId,
  });

  if (!comment) {
    res.status(StatusCodes.NOT_FOUND).send(`Comment ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  if (comment.createdBy !== req.user.id) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Update A Comment You Didn\'t Create');
    return;
  }

  comment = Object.assign(comment, req.body);
  const saved = await comment.save();
  const populated = await saved.populate('createdBy', '_id image username email').execPopulate();

  res.send(populated.toObject());
}
