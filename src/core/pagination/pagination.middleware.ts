import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IPaginationRequest } from './pagination-request.interface';
import { Pagination, PaginationSchema } from './pagination.dto';

export async function pagination(req: IPaginationRequest, res: Response, next: NextFunction) {
  const valid = PaginationSchema.validate({
    ...req.query,
    sort: `${req.query.sort || ''}`.split(',').filter(s => !!s),
  }, {
    allowUnknown: false,
    abortEarly: false,
  });

  if (valid.error) {
    res.status(StatusCodes.BAD_REQUEST).send({
      errors: valid.error.details.map(err => ({
        path: err.path,
        message: err.message,
      })),
    });

    return;
  }

  req.pagination = new Pagination(valid.value);
  next();
};
