import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { OrganizationModel } from '../../organization.entity';
import { organizationDocument } from '../../organization-document.mock';

import { remove } from './remove';

describe('remove', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { orgName: 'test' },
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

    await remove(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should be invalid user', async () => {
    const organization = organizationDocument();
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const sendSpy = spyOn(params.response, 'send');
    const findSpy = jest.spyOn(OrganizationModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(organization),
    } as any);

    await remove(params.request, params.response);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find and remove organization', async () => {
    const organization = organizationDocument({ owners: [params.request.user.id] });
    const statusSpy = spyOn(params.response, 'status');
    const sendSpy = spyOn(params.response, 'send');
    const findSpy = jest.spyOn(OrganizationModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(organization),
    } as any);

    await remove(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
