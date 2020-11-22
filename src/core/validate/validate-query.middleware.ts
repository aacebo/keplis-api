import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as joi from 'joi';

export function validateQuery(Schema: joi.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const valid = Schema.validate(req.query, {
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

    req.query = valid.value;
    next();
  };
}
