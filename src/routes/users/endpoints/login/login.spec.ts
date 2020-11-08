import { StatusCodes } from 'http-status-codes';
import * as mocks from '../../../../testing/mocks';

import { UserModel } from '../../user.entity';

import { login } from './login';

describe('login', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeAll(() => {
    process.env.SECRET = 'test';
  });

  beforeEach(() => {
    params.request = mocks.request({ body: { email: 'test@test.com' } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find user', async () => {
    const findSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(undefined);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const sendSpy = spyOn(params.response, 'send');

    await login(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find user and return token', async () => {
    const findSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mocks.userDocument() as any);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const sendSpy = spyOn(params.response, 'send');

    await login(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
