import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { OrganizationModel } from '../../../organizations/organization.entity';
import { organizationDocument } from '../../../organizations/organization-document.mock';

import { ProjectModel } from '../../../projects/project.entity';
import { projectDocument } from '../../../projects/project-document.mock';

import { TicketModel } from '../../../tickets/ticket.entity';
import { ticketDocument } from '../../../tickets/ticket-document.mock';

import { CommentModel } from '../../comment.entity';
import { commentDocument } from '../../comment-document.mock';

import { remove } from './remove';

describe('remove', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { orgName: 'test', projectName: 'test', ticketNumber: '1', commentId: 'test' },
      body: commentDocument().toObject(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find organization', async () => {
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(undefined);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await remove(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should not find project', async () => {
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findProjectSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(undefined);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await remove(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findProjectSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should not find ticket', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findProjectSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(projectDocument() as any);
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(undefined);

    await remove(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findProjectSpy).toHaveBeenCalledTimes(1);
    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should not find comment', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findProjectSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(projectDocument() as any);
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(ticketDocument() as any);
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockResolvedValueOnce(undefined);

    await remove(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findProjectSpy).toHaveBeenCalledTimes(1);
    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should be unauthorized', async () => {
    const comment = commentDocument();
    jest.spyOn(comment, 'save').mockResolvedValueOnce({
      populate: () => ({
        execPopulate: () => Promise.resolve(comment),
      }),
    } as any);

    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const sendSpy = spyOn(params.response, 'send');
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findProjectSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(projectDocument() as any);
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(ticketDocument() as any);
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockResolvedValueOnce(comment as any);

    await remove(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findProjectSpy).toHaveBeenCalledTimes(1);
    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should update', async () => {
    const comment = commentDocument({ createdBy: params.request.user.id });
    jest.spyOn(comment, 'save').mockResolvedValueOnce({
      populate: () => ({
        execPopulate: () => Promise.resolve(comment),
      }),
    } as any);

    const statusSpy = spyOn(params.response, 'status');
    const sendSpy = spyOn(params.response, 'send');
    const findOrgSpy = jest.spyOn(OrganizationModel, 'findOne').mockResolvedValueOnce(organizationDocument() as any);
    const findProjectSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(projectDocument() as any);
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(ticketDocument() as any);
    const findCommentSpy = jest.spyOn(CommentModel, 'findOne').mockResolvedValueOnce(comment as any);

    await remove(params.request, params.response);

    expect(findOrgSpy).toHaveBeenCalledTimes(1);
    expect(findProjectSpy).toHaveBeenCalledTimes(1);
    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(findCommentSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
