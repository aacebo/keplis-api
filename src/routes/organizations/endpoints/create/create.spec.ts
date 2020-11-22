import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';
import { OrganizationModel } from '../../organization.entity';

import { create } from './create';

jest.mock('../../organization.entity', () => ({
  OrganizationModel: class {
    static findOne() { return Promise.resolve(mocks.organizationDocument()); }
    toObject() { }
    save() { return Promise.resolve(); }
    populate() { return this; }
    execPopulate() { return Promise.resolve(mocks.organizationDocument()); }
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
      body: mocks.organizationDocument().toObject(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should find organization', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(mocks.organizationDocument() as any);

    await create(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenLastCalledWith(StatusCodes.CONFLICT);
  });

  it('should create', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(undefined);

    await create(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.CREATED);
  });
});
