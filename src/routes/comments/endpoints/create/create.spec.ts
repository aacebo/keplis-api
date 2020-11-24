import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

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
      params: { ticketNumber: '1' },
      body: commentDocument().toObject(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find ticket', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(undefined);

    await create(params.request, params.response);

    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should create', async () => {
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(ticketDocument() as any);
    const statusSpy = spyOn(params.response, 'status').and.callThrough();

    await create(params.request, params.response);

    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.CREATED);
  });
});
