import * as mocks from '../../../../testing/mocks';

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
      pagination: { filter: '', skip: 0, sort: [] },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should find tickets', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status');
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

    expect(countTicketSpy).toHaveBeenCalledTimes(1);
    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
