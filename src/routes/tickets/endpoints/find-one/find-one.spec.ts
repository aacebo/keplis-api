import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../testing/mocks';

import { TicketModel } from '../../ticket.entity';
import { ticketDocument } from '../../ticket-document.mock';

import { findOne } from './find-one';

describe('findOne', () => {
  const ticket = ticketDocument();
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request({
      params: {
        ticketNumber: '1',
      }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find ticket', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(undefined),
    } as any);

    await findOne(params.request, params.response);

    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should find ticket', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status');
    const findTicketSpy = jest.spyOn(TicketModel, 'findOne').mockReturnValueOnce({
      populate: (..._args: string[]) => Promise.resolve(ticket),
    } as any);

    await findOne(params.request, params.response);

    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
