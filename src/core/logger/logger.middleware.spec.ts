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

  it('should log success request', () => {
    const loggerSpy = spyOn(Logger, 'success');
    const nextSpy = spyOn(params, 'next');

    logger(params.request, params.response, params.next);
    logger({ } as any, params.response, params.next);

    expect(nextSpy).toHaveBeenCalledTimes(2);
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });

  it('should log warn request', () => {
    const loggerSpy = spyOn(Logger, 'warn');
    const nextSpy = spyOn(params, 'next');

    logger(params.request, mocks.response({ statusCode: 404 }), params.next);

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(loggerSpy).toHaveBeenCalledTimes(1);
  });

  it('should log error request', () => {
    const loggerSpy = spyOn(Logger, 'error');
    const nextSpy = spyOn(params, 'next');

    logger(params.request, mocks.response({ statusCode: 500 }), params.next);

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(loggerSpy).toHaveBeenCalledTimes(1);
  });
});
