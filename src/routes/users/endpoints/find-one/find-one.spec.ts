import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { UserModel } from '../../user.entity';

import { findOne } from './find-one';

describe('findOne', () => {
  const user = mocks.userDocument();
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.request = mocks.request({ params: { username: 'test' } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find user', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(undefined);
    const sendSpy = spyOn(params.response, 'send');

    await findOne(params.request, params.response);

    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find user', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(user as any);
    const sendSpy = spyOn(params.response, 'send');

    await findOne(params.request, params.response);

    expect(statusSpy).not.toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
