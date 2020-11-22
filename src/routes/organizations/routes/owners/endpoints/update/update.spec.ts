import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../../../testing/mocks';
import { UserModel, userDocument } from '../../../../../users';

import { OrganizationModel } from '../../../../organization.entity';
import { organizationDocument } from '../../../../organization-document.mock';

import { update } from './update';

describe('update', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { orgName: 'test' },
      body: { username: 'test' },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find organization', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findSpy = jest.spyOn(OrganizationModel, 'findOne').mockReturnValueOnce({
      populate: () => Promise.resolve(undefined),
    } as any);

    await update(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should not find user', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findUserSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(undefined);
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockReturnValueOnce({
      populate: () => Promise.resolve(organizationDocument()),
    } as any);

    await update(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findUserSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should be unauthorized', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findUserSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userDocument() as any);
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockReturnValueOnce({
      populate: () => Promise.resolve(organizationDocument()),
    } as any);

    await update(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findUserSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
  });

  it('should add user as owner', async () => {
    const user = userDocument();
    const organization = organizationDocument({ owners: [params.request.user.id] });

    const statusSpy = spyOn(params.response, 'status');
    const sendSpy = spyOn(params.response, 'send');
    const findUserSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(user as any);
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockReturnValueOnce({
      populate: () => Promise.resolve(organization),
    } as any);

    await update(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findUserSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledWith({
      ...organization.toObject(),
      owners: [
        params.request.user.id,
        user._id,
      ],
    });
  });

  it('should remove user from owners', async () => {
    const user = userDocument();
    const organization = organizationDocument({ owners: [params.request.user.id, user._id] });

    const statusSpy = spyOn(params.response, 'status');
    const sendSpy = spyOn(params.response, 'send');
    const findUserSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(user as any);
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockReturnValueOnce({
      populate: () => Promise.resolve(organization),
    } as any);

    await update(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findUserSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledWith({
      ...organization.toObject(),
      owners: [
        params.request.user.id,
      ],
    });
  });
});
