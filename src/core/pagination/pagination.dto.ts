import * as joi from 'joi';

export class Pagination {
  readonly page: number;
  readonly perPage: number;
  readonly sort: string[];
  readonly filter: string;

  get skip() {
    return (this.page - 1) * this.perPage;
  }

  constructor(args?: Partial<Pagination>) {
    Object.assign(this, args);
  }
}

export const PaginationSchema = joi.object<Pagination>({
  page: joi.number().min(1).default(1),
  perPage: joi.number().min(1).default(10),
  sort: joi.array().items(joi.string()).default([]),
  filter: joi.string().default(''),
});
