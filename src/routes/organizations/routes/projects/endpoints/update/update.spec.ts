import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../../../testing/mocks';
import { OrganizationModel } from '../../../../organization.entity';

import { ProjectModel } from '../../project.entity';

import { update } from './update';

describe('update', () => {
  const project = mocks.projectDocument();
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.request = mocks.request({ params: { orgName: 'test', projectName: 'test' } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find organization', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOneSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(undefined);

    await update(params.request, params.response);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should be unauthorized', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOneSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(mocks.organizationDocument() as any);

    await update(params.request, params.response);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should not find project', async () => {
    const organization = mocks.organizationDocument({ owners: [params.request.user.id] });

    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOneSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organization as any);
    const findSpy = jest.spyOn(ProjectModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(undefined),
    } as any);

    await update(params.request, params.response);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  it('should find project', async () => {
    const organization = mocks.organizationDocument({ owners: [params.request.user.id] });

    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOneSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organization as any);
    const findSpy = jest.spyOn(ProjectModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(project),
    } as any);

    await update(params.request, params.response);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
