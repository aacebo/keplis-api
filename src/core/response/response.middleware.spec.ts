import * as mocks from '../../testing/mocks';

import { responseMiddlware } from './response.middleware';

describe('response', () => {
  const baseUrl = '/test';
  const path = '/1/this';
  const body = { email: 'test@test.com' };
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.request = mocks.request({ pagination: undefined });
    params.response = mocks.response();
  });

  it('should return when no data', () => {
    const res = responseMiddlware(undefined, params.request, params.response as any);
    expect(res).toBeUndefined();
  });

  it('should return response payload', () => {
    const res = responseMiddlware(body, params.request, params.response as any);
    expect(res).toEqual({
      user: params.request.user,
      data: body,
    });
  });

  describe('pagination', () => {
    it('should get first page links', () => {
      params.request = mocks.request({ baseUrl, path, pagination: { page: 1, perPage: 10 }, total: 100 });
      const res = responseMiddlware(body, params.request, params.response as any);

      expect(res).toEqual({
        user: params.request.user,
        meta: {
          total: 100,
          pages: 10,
        },
        links: {
          first: `${baseUrl}${path}?page=1`,
          last: `${baseUrl}${path}?page=10`,
          next: `${baseUrl}${path}?page=2`,
        },
        data: body,
      });
    });

    it('should get last page links', () => {
      params.request = mocks.request({ baseUrl, path, pagination: { page: 10, perPage: 10 }, total: 100 });
      const res = responseMiddlware(body, params.request, params.response as any);

      expect(res).toEqual({
        user: params.request.user,
        meta: {
          total: 100,
          pages: 10,
        },
        links: {
          first: `${baseUrl}${path}?page=1`,
          last: `${baseUrl}${path}?page=10`,
          prev: `${baseUrl}${path}?page=9`,
        },
        data: body,
      });
    });

    it('should get middle page links', () => {
      params.request = mocks.request({ baseUrl, path, pagination: { page: 5, perPage: 10 }, total: 100 });
      const res = responseMiddlware(body, params.request, params.response as any);

      expect(res).toEqual({
        user: params.request.user,
        meta: {
          total: 100,
          pages: 10,
        },
        links: {
          first: `${baseUrl}${path}?page=1`,
          last: `${baseUrl}${path}?page=10`,
          next: `${baseUrl}${path}?page=6`,
          prev: `${baseUrl}${path}?page=4`,
        },
        data: body,
      });
    });

    it('should show perPage and sort when defaults not present', () => {
      params.request = mocks.request({ baseUrl, path, pagination: { page: 1, perPage: 20, sort: ['createdAt'] }, total: 100 });
      const res = responseMiddlware(body, params.request, params.response as any);

      expect(res).toEqual({
        user: params.request.user,
        meta: {
          total: 100,
          pages: 5,
        },
        links: {
          first: `${baseUrl}${path}?page=1&perPage=20&sort=createdAt`,
          last: `${baseUrl}${path}?page=5&perPage=20&sort=createdAt`,
          next: `${baseUrl}${path}?page=2&perPage=20&sort=createdAt`,
        },
        data: body,
      });
    });
  });
});
