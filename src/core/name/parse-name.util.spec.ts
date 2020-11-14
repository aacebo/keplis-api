import { parseName } from './parse-name.util';
import { NAME_REGEX } from './name.regex';

describe('parseName', () => {
  it('should parse name', () => {
    const text = 'T-% Blast!! off';
    const name = parseName(text);

    expect(text.match(NAME_REGEX)).toBeNull();
    expect(name.match(NAME_REGEX).length).toEqual(1);
  });
});
