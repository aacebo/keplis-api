import * as util from 'util';

import { Cache } from './cache';

describe('Cache', () => {
  let cache = new Cache({ maxAge: 5000, maxKeys: 3 });
  const sleep = util.promisify(setTimeout);

  afterEach(() => {
    cache.clear();
  });

  describe('has', () => {
    it('should exist', () => {
      cache.set('test', 'test');
      expect(cache.has('test')).toBe(true);
    });

    it('should not exist', () => {
      expect(cache.has('test')).toBe(false);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      cache = new Cache({ maxAge: 100, maxKeys: 3 });
    });

    it('should get value', () => {
      cache.set('test', 'value');
      expect(cache.get('test')).toEqual('value');
    });

    it('should invalidate when outdated', async () => {
      cache.set('test', 'value');
      await sleep(100);
      expect(cache.get('test')).toBeUndefined();
    });
  });

  describe('set', () => {
    beforeEach(() => {
      cache = new Cache({ maxAge: 5000, maxKeys: 3 });
    });

    it('should set value', () => {
      cache.set('test', 'value');
      expect(cache.get('test')).toEqual('value');
    });

    it('should remove value before setting new', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4);
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('d')).toEqual(4);
    });
  });

  describe('delete', () => {
    it('should delete key', () => {
      cache.set('test', 'value');
      cache.delete('test');
      expect(cache.get('test')).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should clear all keys', () => {
      cache.set('test', 'value');
      cache.clear();
      expect(cache.get('test')).toBeUndefined();
    });
  });
});
