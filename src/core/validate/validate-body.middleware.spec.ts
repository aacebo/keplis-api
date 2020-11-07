import * as joi from 'joi';
import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../testing/mocks';

import { validateBody } from './validate-body.middleware';

const TestSchema = joi.object({
  count: joi.number(),
});

describe('validateBody', () => {
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

  it('should be invalid', () => {
    params.request = mocks.request({ body: { count: 'test' } });
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const nextSpy = spyOn(params, 'next');

    validateBody(TestSchema)(params.request as any, params.response as any, params.next);

    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it('should be valid', () => {
    params.request = mocks.request({ body: { count: 10 } });
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const nextSpy = spyOn(params, 'next');

    validateBody(TestSchema)(params.request as any, params.response as any, params.next);

    expect(statusSpy).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });
});
