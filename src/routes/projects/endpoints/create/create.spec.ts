import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';
import { OrganizationModel } from '../../../organizations/organization.entity';
import { organizationDocument } from '../../../organizations/organization-document.mock';

import { ProjectModel } from '../../project.entity';
import { projectDocument } from '../../project-document.mock';

import { create } from './create';

jest.mock('../../project.entity', () => ({
  ProjectModel: class {
    static findOne() { return Promise.resolve(projectDocument()); }
    toObject() { }
    save() { return Promise.resolve(); }
    populate() { return this; }
    execPopulate() { return Promise.resolve(projectDocument()); }
  },
}));

describe('create', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { orgName: 'test' },
      body: projectDocument().toObject(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find organization', async () => {
    const findSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(undefined);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await create(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });


  it('should find project', async () => {
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findProjectSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(projectDocument() as any);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await create(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findProjectSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.CONFLICT);
  });

  it('should create', async () => {
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findProjectSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(undefined);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await create(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findProjectSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.CREATED);
  });
});
