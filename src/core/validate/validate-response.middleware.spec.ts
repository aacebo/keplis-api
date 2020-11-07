import { StatusCodes } from 'http-status-codes';
import * as joi from 'joi';

import * as mocks from '../../testing/mocks';

import { validateResponse, validateResponseMiddleware } from './validate-response.middleware';

const TestSchema = joi.object({
  count: joi.number().max(10).required(),
});

describe('validateResponse', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.request = mocks.request();
    params.response = mocks.response();
  });

  it('should be a function', () => {
    expect(typeof validateResponse(TestSchema)).toEqual('function');
  });

  it('should return when no body', () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    const res = validateResponseMiddleware(TestSchema, undefined, params.request, params.response as any);

    expect(statusSpy).not.toHaveBeenCalled();
    expect(res).toBeUndefined();
  });

  it('should throw error when invalid', () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    const res = validateResponseMiddleware(TestSchema, { count: 'test' }, params.request, params.response as any);

    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res).toBeUndefined();
  });

  it('should not allow unknown props', () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    const res = validateResponseMiddleware(TestSchema, { count: 5, test: 'test' }, params.request, params.response as any);

    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res).toBeUndefined();
  });

  it('should return value when complete', () => {
    const statusSpy = spyOn(params.response, 'status');

    const res = validateResponseMiddleware(TestSchema, { count: 10 }, params.request, params.response as any);

    expect(statusSpy).not.toHaveBeenCalled();
    expect(res).toEqual({ count: 10 });
  });
});
