import { ICacheOptions } from './cache-options.interface';

export class Cache<T = any> {
  private readonly _values = new Map<string, T>();
  private readonly _ages = new Map<string, number>();
  private readonly _hits = new Map<string, number>();

  constructor(private readonly _options: ICacheOptions) { }

  has(key: string) {
    return this._values.has(key);
  }

  get(key: string) {
    const hits = this._hits.get(key);

    if (this._isOutdated(key)) {
      this.delete(key);
      return;
    }

    this._hits.set(key, hits + 1);
    return this._values.get(key);
  }

  set(key: string, value: T) {
    if (this._values.size >= this._options.maxKeys) {
      this.delete(this._leastFrequentlyUsed());
    }

    this._ages.set(key, new Date().getTime());
    this._hits.set(key, 0);
    this._values.set(key, value);
  }

  delete(key: string) {
    this._values.delete(key);
    this._ages.delete(key);
    this._hits.delete(key);
  }

  clear() {
    this._values.clear();
    this._ages.clear();
    this._hits.clear();
  }

  private _leastFrequentlyUsed() {
    let leastKey: string;
    let leastValue = Infinity;

    for (const [k, v] of Array.from(this._hits.entries())) {
      if (v < leastValue) {
        leastKey = k;
        leastValue = v;
      }
    }

    return leastKey;
  }

  private _isOutdated(key: string) {
    const age = this._ages.get(key);
    return (new Date().getTime() - age) >= this._options.maxAge;
  }
}
