import * as mocks from '../../../../../../testing/mocks';

import { TicketModel } from '../../../../ticket.entity';
import { TicketLabel } from '../../../../ticket-label.enum';

import { labels } from './labels';

describe('labels', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
  };

  beforeEach(() => {
    params.response = mocks.response();
    params.request = mocks.request();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get aggregate', async () => {
    const statusSpy = spyOn(params.response, 'status');
    const countTicketSpy = jest.spyOn(TicketModel, 'countDocuments').mockResolvedValueOnce(100);
    const aggTicketSpy = jest.spyOn(TicketModel, 'aggregate').mockResolvedValueOnce(mocks.aggregate(Object.values(TicketLabel)));

    await labels(params.request, params.response);

    expect(statusSpy).not.toHaveBeenCalled();
    expect(countTicketSpy).toHaveBeenCalledTimes(1);
    expect(aggTicketSpy).toHaveBeenCalledTimes(1);
  });
});
