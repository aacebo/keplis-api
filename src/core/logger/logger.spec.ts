import Logger from './logger';

describe('Logger', () => {
  it('shoud log info', () => {
    const spy = spyOn(console, 'info');
    Logger.info('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should log success', () => {
    const spy = spyOn(console, 'log');
    Logger.success('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('shoud log warn', () => {
    const spy = spyOn(console, 'warn');
    Logger.warn('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('shoud log error', () => {
    const spy = spyOn(console, 'error');
    Logger.error('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
