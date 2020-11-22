import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { OrganizationModel } from '../../../organizations/organization.entity';
import { organizationDocument } from '../../../organizations/organization-document.mock';

import { ProjectModel } from '../../../projects/project.entity';
import { projectDocument } from '../../../projects/project-document.mock';

import { TicketModel } from '../../../tickets/ticket.entity';
import { ticketDocument } from '../../../tickets/ticket-document.mock';

import { commentDocument } from '../../comment-document.mock';

import { create } from './create';

jest.mock('../../comment.entity', () => ({
  CommentModel: class {
    toObject() { }
    save() { return Promise.resolve(); }
    populate() { return this; }
    execPopulate() { return Promise.resolve(commentDocument()); }
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
      params: { orgName: 'test', projectName: 'test', ticketNumber: '1' },
      body: commentDocument().toObject(),
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

  it('should not find project', async () => {
    const findSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findOneSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(undefined);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await create(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should not find ticket', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findProjectSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(projectDocument() as any);
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(undefined);

    await create(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findProjectSpy).toHaveBeenCalledTimes(1);
    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should create', async () => {
    const findSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findOneSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(projectDocument() as any);
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(ticketDocument() as any);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await create(params.request, params.response);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.CREATED);
  });
});
