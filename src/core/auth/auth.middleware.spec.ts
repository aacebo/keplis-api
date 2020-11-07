import * as uuid from 'uuid';
import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../testing/mocks';
import { UserModel } from '../../routes/users/user.entity';

import { auth } from './auth.middleware';

describe('auth', () => {
  let id: string;
  const params = {
    request: mocks.request(),
    response: mocks.response(),
    next: () => {},
  };

  beforeAll(() => {
    id = uuid.v4();
    process.env.SECRET = 'test';
  });

  beforeEach(() => {
    params.request = mocks.request();
    params.response = mocks.response();
    params.next = () => {};
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not get token', async () => {
    const headerSpy = spyOn(params.request, 'header');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const nextSpy = spyOn(params, 'next');
    const findSpy = spyOn(UserModel, 'findById')

    await auth(params.request as any, params.response as any, params.next);

    expect(headerSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(findSpy).not.toHaveBeenCalled();
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it('should get token but not find user', async () => {
    const headerSpy = spyOn(params.request, 'header').and.returnValue(`Bearer ${mocks.token()}`);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const nextSpy = spyOn(params, 'next');
    const findSpy = jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(undefined);

    await auth(params.request as any, params.response as any, params.next);

    expect(headerSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it('should get token and find user', async () => {
    const headerSpy = spyOn(params.request, 'header').and.returnValue(`Bearer ${mocks.token(id)}`);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const nextSpy = spyOn(params, 'next');
    const findSpy = jest.spyOn(UserModel, 'findById').mockResolvedValueOnce({ _id: id } as any);

    await auth(params.request as any, params.response as any, params.next);

    expect(headerSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(params.request.user).toBeDefined();
  });

  it('should get token and find user in cache', async () => {
    const headerSpy = spyOn(params.request, 'header').and.returnValue(`Bearer ${mocks.token(id)}`);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const nextSpy = spyOn(params, 'next');
    const findSpy = spyOn(UserModel, 'findById');

    await auth(params.request as any, params.response as any, params.next);

    expect(headerSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(findSpy).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });
});
