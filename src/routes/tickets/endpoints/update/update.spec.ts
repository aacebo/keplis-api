import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { TicketModel } from '../../ticket.entity';
import { ticketDocument } from '../../ticket-document.mock';

import { update } from './update';

describe('update', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: { ticketNumber: '1' },
      body: ticketDocument().toObject(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find ticket', async () => {
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(undefined);

    await update(params.request, params.response);

    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should be unauthorized', async () => {
    const ticket = ticketDocument();
    jest.spyOn(ticket, 'save').mockResolvedValueOnce({
      populate: () => ({
        execPopulate: () => Promise.resolve(ticket),
      }),
    } as any);

    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const sendSpy = spyOn(params.response, 'send');
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(ticket as any);

    await update(params.request, params.response);

    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should update', async () => {
    const ticket = ticketDocument({ createdBy: params.request.user.id });
    jest.spyOn(ticket, 'save').mockResolvedValueOnce({
      populate: () => ({
        execPopulate: () => Promise.resolve(ticket),
      }),
    } as any);

    const statusSpy = spyOn(params.response, 'status');
    const sendSpy = spyOn(params.response, 'send');
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockResolvedValueOnce(ticket as any);

    await update(params.request, params.response);

    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
