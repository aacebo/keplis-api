import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { create } from './create';

jest.mock('../../organization.entity', () => ({
  OrganizationModel: class {
    toObject() { }
    save() { return Promise.resolve(); }
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

  it('should create', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await create(params.request, params.response);

    expect(statusSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.CREATED);
  });
});
