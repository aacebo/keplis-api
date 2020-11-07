import { Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IPaginationRequest } from './pagination-request.interface';
import { Pagination, PaginationSchema } from './pagination.dto';

export async function pagination(req: IPaginationRequest, res: Response, next: NextFunction) {
  const valid = PaginationSchema.validate({
    ...req.query,
    sort: `${req.query.sort || ''}`.split(',').filter(s => !!s),
  }, { stripUnknown: true });

  if (valid.error) {
    res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    return;
  }

  req.pagination = new Pagination(valid.value);
  next();
};
