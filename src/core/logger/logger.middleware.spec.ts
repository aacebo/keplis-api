import * as mocks from '../../testing/mocks';

import { logger } from './logger.middleware';
import Logger from './logger';

describe('logger', () => {
  const params = {
    request: mocks.request(),
    response: mocks.response(),
    next: () => {},
  };

  beforeEach(() => {
    params.request = mocks.request();
    params.response = mocks.response();
    params.next = () => {};
  });

  it('should log request', () => {
    const loggerSpy = spyOn(Logger, 'info');
    const nextSpy = spyOn(params, 'next');

    logger(params.request as any, params.response as any, params.next);
    logger({ } as any, params.response as any, params.next);

    expect(nextSpy).toHaveBeenCalledTimes(2);
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });
});
