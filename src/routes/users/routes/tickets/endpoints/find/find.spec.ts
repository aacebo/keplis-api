import { StatusCodes } from 'http-status-codes';

import * as mocks from '../../../../../../testing/mocks';

import { TicketModel } from '../../../../../tickets/ticket.entity';
import { ticketDocument } from '../../../../../tickets/ticket-document.mock';

import { UserModel } from '../../../../user.entity';
import { userDocument } from '../../../../user-document.mock';

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
      params: { username: 'test' },
      pagination: { filter: '', skip: 0, sort: [] },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not find user', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status').and.callThrough();
    const findUserSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(undefined);

    await find(params.request, params.response);

    expect(sendSpy).not.toHaveBeenCalled();
    expect(findUserSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should find tickets', async () => {
    const sendSpy = spyOn(params.response, 'send');
    const statusSpy = spyOn(params.response, 'status');
    const findUserSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userDocument() as any);
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

    expect(findUserSpy).toHaveBeenCalledTimes(1);
    expect(countTicketSpy).toHaveBeenCalledTimes(1);
    expect(findTicketSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
