import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { devUserToken } from '../../../../seed/dev-user-token';
import { DEV_USER } from '../../../../seed/dev-user';
import { startTestServer } from '../../../../testing/utils';

import { organization } from '../../organization.mock';

describe('[e2e] /users/:username/organizations', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;

  beforeAll(async () => {
    request = await startTestServer();
    token = devUserToken();
  });

  beforeAll(async () => {
    const payload = organization();

    await request.post('/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);
  });

  describe('find', () => {
    it('should not find user', (done) => {
      request.get(`/users/1/organizations`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find user organizations', (done) => {
      request.get(`/users/${DEV_USER.username}/organizations`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.user).toBeDefined();
          expect(body.meta).toBeDefined();
          expect(body.links).toBeDefined();
          expect(body.data.length).toEqual(1);
        })
        .end(done);
    });
  });
});
