import { StatusCodes } from 'http-status-codes';
import * as uuid from 'uuid';

import * as mocks from '../../../../testing/mocks';

import { OrganizationModel } from '../../organization.entity';

import { findOne } from './find-one';

describe('findOne', () => {
  const organization = mocks.organizationDocument();
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.request = mocks.request({ params: { orgId: uuid.v4() } });
    params.response = mocks.response();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find organization', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findSpy = jest.spyOn(OrganizationModel, 'findById').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(undefined),
    } as any);

    await findOne(params.request, params.response);

    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  it('should find organization', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findSpy = jest.spyOn(OrganizationModel, 'findById').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(organization),
    } as any);

    await findOne(params.request, params.response);

    expect(statusSpy).not.toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
