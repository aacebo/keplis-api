import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../../../../../testing/mocks';

import { TicketModel } from '../../../../../../../tickets/ticket.entity';
import { TicketLabel } from '../../../../../../../tickets/ticket-label.enum';

import { OrganizationModel } from '../../../../../../organization.entity';
import { organizationDocument } from '../../../../../../organization-document.mock';

import { types } from './types';

describe('types', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { orgName: 'test' },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find organization', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(undefined);

    await types(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should get aggregate', async () => {
    const statusSpy = spyOn(params.response, 'status');
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const countTicketSpy = jest.spyOn(TicketModel, 'countDocuments').mockResolvedValueOnce(100);
    const aggTicketSpy = jest.spyOn(TicketModel, 'aggregate').mockResolvedValueOnce(mocks.aggregate(Object.values(TicketLabel)));

    await types(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(countTicketSpy).toHaveBeenCalledTimes(1);
    expect(aggTicketSpy).toHaveBeenCalledTimes(1);
  });
});
