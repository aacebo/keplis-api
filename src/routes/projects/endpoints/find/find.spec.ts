import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { OrganizationModel } from '../../../organizations/organization.entity';
import { organizationDocument } from '../../../organizations/organization-document.mock';

import { ProjectModel } from '../../project.entity';
import { projectDocument } from '../../project-document.mock';

import { find } from './find';

describe('find', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  const posts = [
    projectDocument(),
    projectDocument(),
    projectDocument(),
  ];

  beforeEach(() => {
    params.request = mocks.request({ params: { orgName: 'test' }, pagination: { filter: '', skip: 0, sort: [] } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find organization', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOneSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(undefined);

    await find(params.request, params.response);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find projects', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const findOneSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const countSpy = jest.spyOn(ProjectModel, 'countDocuments').mockResolvedValueOnce(100);
    const findSpy = jest.spyOn(ProjectModel, 'find').mockReturnValueOnce({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: (..._args: string[]) => Promise.resolve(posts),
          }),
        }),
      }),
    } as any);

    await find(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(countSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(posts.map(p => {
      delete p.toObject;
      delete p.save;

      return {
        ...p,
      };
    }));
  });
});
