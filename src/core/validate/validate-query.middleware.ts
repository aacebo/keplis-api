import { Request, Response, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import * as joi from 'joi';

export function validateQuery(Schema: joi.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const valid = Schema.validate(req.query, { stripUnknown: true });

    if (valid.error) {
      res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
      return;
    }

    req.query = valid.value;
    next();
  };
}
