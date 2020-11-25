import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../../../core/auth';

import { CommentModel, Comment } from '../../../../comment.entity';

export async function find(req: IAuthRequest, res: Response) {
  const comment = await CommentModel.findById(req.params.commentId)
    .populate({
      path: 'comments',
      populate: [{
        path: 'createdBy',
        select: '_id image username email',
        model: 'User',
      }, {
        path: 'likes',
        select: '_id username',
        model: 'User',
      }],
    });

  if (!comment) {
    res.status(StatusCodes.NOT_FOUND).send(`Comment ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  res.send(comment.toObject().comments.map((c: Comment) => ({
    ...c,
    comments: c.comments.length,
  })));
}
