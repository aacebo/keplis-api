import { Request, Response, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import * as joi from 'joi';

export function validateBody(Schema: joi.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const valid = Schema.validate(req.body, { stripUnknown: true });

    if (valid.error) {
      res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
      return;
    }

    req.body = valid.value;
    next();
  };
}
