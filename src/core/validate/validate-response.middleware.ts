import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import * as mung from 'express-mung';
import * as joi from 'joi';

import Logger from '../logger';

export function validateResponseMiddleware(Schema: joi.Schema, body: { }, _req: Request, res: Response) {
  if (!body) return;

  const valid = Schema.validate(body, { allowUnknown: false });

  if (valid.error) {
    Logger.warn(valid.error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    return;
  }

  return valid.value;
}

export function validateResponse(Schema: joi.Schema) {
  return mung.json(
    /* istanbul ignore next */
    (body, req, res) => {
      return validateResponseMiddleware(Schema, body, req, res);
    }
  );
};
