import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../../../core/auth';

import { CreateCommentRequest } from '../../../../../tickets/routes/comments/endpoints/create/create-request.dto';

import { CommentModel } from '../../../../comment.entity';

export async function create(req: IAuthRequest<any, any, CreateCommentRequest>, res: Response) {
  const comment = await CommentModel.findById(req.params.commentId);

  if (!comment) {
    res.status(StatusCodes.NOT_FOUND).send(`Comment ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const subComment = new CommentModel({
    ...req.body,
    createdBy: req.user.id,
  }).populate('createdBy', '_id image username email')
    .populate('likes', '_id username');

  await subComment.save();
  const saved = await subComment.execPopulate();

  comment.comments.push(saved._id);
  await comment.save();

  res.status(StatusCodes.CREATED).send(saved.toObject());
}
