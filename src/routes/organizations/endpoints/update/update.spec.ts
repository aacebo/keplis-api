import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { OrganizationModel } from '../../organization.entity';

import { update } from './update';

describe('update', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { name: 'test' },
      body: { name: 'test' },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find organization', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const sendSpy = spyOn(params.response, 'send');
    const findSpy = jest.spyOn(OrganizationModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(undefined),
    } as any);

    await update(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should be invalid user', async () => {
    const organization = mocks.organizationDocument();
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const sendSpy = spyOn(params.response, 'send');
    const findSpy = jest.spyOn(OrganizationModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(organization),
    } as any);

    await update(params.request, params.response);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find and update organization', async () => {
    const organization = mocks.organizationDocument({ owners: [params.request.user.id] });
    const statusSpy = spyOn(params.response, 'status');
    const sendSpy = spyOn(params.response, 'send');
    const findSpy = jest.spyOn(OrganizationModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(organization),
    } as any);

    await update(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
