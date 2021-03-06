import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';

import { IPaginationRequest } from '../../../../core/pagination';

import { CommentModel, Comment, ICommentDocument } from '../../comment.entity';

export async function find(req: IPaginationRequest, res: Response) {
  const conditions: MongooseFilterQuery<Pick<ICommentDocument, keyof ICommentDocument>> = {
    body: { $regex: req.pagination.filter, $options: 'i' },
    removedAt: { $eq: undefined },
  };

  const [comments, total] = await Promise.all([
    CommentModel.find(conditions)
      .sort(req.pagination.sort.join(' '))
      .skip(req.pagination.skip)
      .limit(req.pagination.perPage)
      .populate('createdBy', '_id image username email')
      .populate('likes', '_id username'),
    CommentModel.countDocuments(conditions),
  ]);

  req.total = total;
  res.send(comments.map(c => c.toObject()).map((c: Comment) => ({
    ...c,
    comments: c.comments.length,
  })));
}
