import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../../../testing/mocks';
import { OrganizationModel } from '../../../../organization.entity';

import { create } from './create';

jest.mock('../../project.entity', () => ({
  ProjectModel: class {
    toObject() { }
    save() { return Promise.resolve(); }
    populate() { return this; }
    execPopulate() { return Promise.resolve(mocks.projectDocument()); }
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
      body: mocks.projectDocument().toObject(),
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

  it('should create', async () => {
    const findSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(mocks.organizationDocument() as any);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await create(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.CREATED);
  });
});
