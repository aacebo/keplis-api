import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { startTestServer } from './testing/utils';

describe('[e2e] /', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    request = await startTestServer();
  });

  it('should get version', (done) => {
    request.get('/')
      .expect(StatusCodes.OK)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      })
      .end(done);
  });
});
