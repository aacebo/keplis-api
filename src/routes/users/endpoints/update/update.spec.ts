import { StatusCodes } from 'http-status-codes';
import * as uuid from 'uuid';

import * as mocks from '../../../../testing/mocks';

import { UserModel } from '../../user.entity';

import { update } from './update';

describe('update', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { userId: uuid.v4() },
      body: { email: 'mynewemail@test.com' },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find user', async () => {
    const findSpy = jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(undefined);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const sendSpy = spyOn(params.response, 'send');

    await update(params.request, params.response as any);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should be invalid user', async () => {
    const user = mocks.userDocument();
    const findSpy = jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(user);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const sendSpy = spyOn(params.response, 'send');

    await update({
      ...params.request,
      user: { id: 'test' },
      }, params.response as any);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find and update user', async () => {
    const user = mocks.userDocument();
    const findSpy = jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(user);
    const statusSpy = spyOn(params.response, 'status');
    const sendSpy = spyOn(params.response, 'send');

    await update({
      ...params.request,
      user: { id: user._id, },
    }, params.response as any);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
