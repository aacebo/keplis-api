import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';
import { OrganizationModel } from '../../../organizations/organization.entity';
import { organizationDocument } from '../../../organizations/organization-document.mock';

import { ProjectModel } from '../../project.entity';
import { projectDocument } from '../../project-document.mock';

import { remove } from './remove';

describe('remove', () => {
  const project = projectDocument();
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.request = mocks.request({ params: { rojectName: 'test' } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find project', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findSpy = jest.spyOn(ProjectModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(undefined),
    } as any);

    await remove(params.request, params.response);

    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  it('should be unauthorized', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOneSpy = jest.spyOn(OrganizationModel, 'findById').mockResolvedValueOnce(organizationDocument() as any);
    const findSpy = jest.spyOn(ProjectModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(project),
    } as any);

    await remove(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find project', async () => {
    const organization = organizationDocument({ owners: [params.request.user.id] });

    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOneSpy = jest.spyOn(OrganizationModel, 'findById').mockResolvedValueOnce(organization as any);
    const findSpy = jest.spyOn(ProjectModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(project),
    } as any);

    await remove(params.request, params.response);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
