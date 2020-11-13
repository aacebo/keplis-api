import { IAuthPayload } from '../auth';

export interface IResponse<T = any> {
  readonly user?: IAuthPayload;
  readonly meta?: {
    readonly total: number;
    readonly pages: number;
  };
  readonly links?: {
    readonly first: string;
    readonly last: string;
    readonly prev: string;
    readonly next: string;
  };
  readonly data?: T;
}
