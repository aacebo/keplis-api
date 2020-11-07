import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../testing/mocks';

import { pagination } from './pagination.middleware';

describe('pagination', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
    next: () => {},
  };

  beforeEach(() => {
    params.request = mocks.request();
    params.response = mocks.response();
    params.next = () => {};
  });

  it('should not get pagination', async () => {
    params.request = mocks.request({
      pagination: undefined,
      query: { page: -1 },
    });

    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const nextSpy = spyOn(params, 'next');

    await pagination(params.request as any, params.response as any, params.next);

    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(nextSpy).not.toHaveBeenCalled();
    expect(params.request.pagination).not.toBeDefined();
  });

  it('should get pagination', async () => {
    params.request = mocks.request({
      pagination: undefined,
      query: { page: 1 },
    });

    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const nextSpy = spyOn(params, 'next');

    await pagination(params.request as any, params.response as any, params.next);

    expect(statusSpy).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(params.request.pagination).toBeDefined();
  });
});
