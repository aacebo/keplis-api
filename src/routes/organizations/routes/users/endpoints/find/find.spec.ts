import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../../../testing/mocks';

import { UserModel } from '../../../../../users/user.entity';
import { userDocument } from '../../../../../users/user-document.mock';

import { OrganizationModel } from '../../../../organization.entity';
import { organizationDocument } from '../../../../organization-document.mock';

import { find } from './find';

describe('find', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  const organizations = [
    organizationDocument(),
    organizationDocument(),
    organizationDocument(),
  ];

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      pagination: { filter: '', skip: 0, sort: [] },
      params: { username: 'test' },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find user', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOneSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(undefined);

    await find(params.request, params.response);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should find organizations', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const findOneSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userDocument() as any);
    const countSpy = jest.spyOn(OrganizationModel, 'countDocuments').mockResolvedValueOnce(100);
    const findSpy = jest.spyOn(OrganizationModel, 'find').mockReturnValueOnce({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: (..._args: string[]) => Promise.resolve(organizations),
          }),
        }),
      }),
    } as any);

    await find(params.request, params.response);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(countSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(organizations.map(o => {
      delete o.toObject;
      delete o.save;

      return {
        ...o,
        owners: o.owners.length,
        projects: o.projects.length,
      };
    }));
  });
});
