import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';
import { OrganizationModel } from '../../../organizations/organization.entity';
import { organizationDocument } from '../../../organizations/organization-document.mock';

import { ProjectModel } from '../../../projects/project.entity';
import { projectDocument } from '../../../projects/project-document.mock';

import { TicketModel } from '../../ticket.entity';
import { ticketDocument } from '../../ticket-document.mock';

import { find } from './find';

describe('find', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  const tickets = [
    ticketDocument(),
    ticketDocument(),
    ticketDocument(),
  ];

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { orgName: 'test', projectName: 'test' },
      pagination: { filter: '', skip: 0, sort: [] },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find organization', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(undefined);

    await find(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should not find project', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findProjectSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(undefined);

    await find(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findProjectSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find tickets', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status');
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findProjectSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(projectDocument() as any);
    const countTicketSpy = jest.spyOn(TicketModel, 'countDocuments').mockResolvedValueOnce(100);
    const findTicketSpy = jest.spyOn(TicketModel, 'find').mockReturnValueOnce({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: (..._args: string[]) => Promise.resolve(tickets),
          }),
        }),
      }),
    } as any);

    await find(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findProjectSpy).toHaveBeenCalledTimes(1);
    expect(countTicketSpy).toHaveBeenCalledTimes(1);
    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
