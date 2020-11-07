import { Response } from 'express';
import * as mung from 'express-mung';
import * as qs from 'qs';

import { IAuthRequest } from '../auth';
import { IPaginationRequest } from '../pagination';

import { IResponse } from './response.interface';

export function responseMiddlware(body: { }, req: IAuthRequest & IPaginationRequest, _res: Response) {
  if (!body) return;

  let links: { [key: string]: string };
  let meta: { [key: string]: string | number };

  if (req.pagination) {
    const url = `${req.baseUrl}${req.path}`;
    const pages = Math.ceil(req.total / req.pagination.perPage);
    const base = {
      perPage: req.pagination.perPage !== 10 ? req.pagination.perPage : undefined,
      filter: req.pagination.filter || undefined,
      sort: req.pagination.sort?.join(',') || undefined,
    };

    const first = qs.stringify({
      page: 1,
      ...base,
    });

    const last = qs.stringify({
      page: pages,
      ...base,
    });

    const next = req.pagination.page < pages ? qs.stringify({
      page: req.pagination.page + 1,
      ...base,
    }) : undefined;

    const prev = req.pagination.page > 1 ? qs.stringify({
      page: req.pagination.page - 1,
      ...base,
    }) : undefined;

    links = {
      first: `${url}?${first}`,
      last: `${url}?${last}`,
      next: next && `${url}?${next}`,
      prev: prev && `${url}?${prev}`,
    };

    meta = {
      total: req.total,
      pages,
    };
  }

  return {
    user: req.user,
    meta,
    links,
    data: body,
  } as IResponse;
}

export const response = mung.json(responseMiddlware);
