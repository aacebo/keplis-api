import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { startTestServer } from './testing/utils';

import * as pkg from '../package.json';

describe('[e2e] /', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    request = await startTestServer();
  });

  it('should get version', (done) => {
    request.get('/').expect(StatusCodes.OK).expect({ version: pkg.version }).end(done);
  });
});
