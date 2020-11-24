import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { ProjectModel } from '../../../projects/project.entity';
import { projectDocument } from '../../../projects/project-document.mock';

import { ticketDocument } from '../../ticket-document.mock';

import { create } from './create';

jest.mock('../../ticket.entity', () => ({
  TicketModel: class {
    toObject() { }
    save() { return Promise.resolve(); }
    populate() { return this; }
    execPopulate() { return Promise.resolve(ticketDocument()); }
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
      params: { projectName: 'test' },
      body: ticketDocument().toObject(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find project', async () => {
    const findOneSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(undefined);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await create(params.request, params.response);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should create', async () => {
    const findOneSpy = jest.spyOn(ProjectModel, 'findOne').mockResolvedValueOnce(projectDocument() as any);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await create(params.request, params.response);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.CREATED);
  });
});
