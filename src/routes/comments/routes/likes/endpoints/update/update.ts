import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../../../core/auth';

import { CommentModel } from '../../../../comment.entity';

export async function update(req: IAuthRequest, res: Response) {
  let comment = await CommentModel.findOne({
    _id: req.params.commentId,
  });

  if (!comment) {
    res.status(StatusCodes.NOT_FOUND).send(`Comment ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const idx = comment.likes.indexOf(req.user.id);

  if (idx > -1) {
    comment.likes.splice(idx, 1);
  } else {
    comment.likes.push(req.user.id);
  }

  const saved = await comment.save();
  const populated = await saved.populate('createdBy', '_id image username email')
                               .populate('likes', '_id username')
                               .execPopulate();

  res.send(populated.toObject());
}
