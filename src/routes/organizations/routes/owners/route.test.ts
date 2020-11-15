import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

import { devUserToken } from '../../../../seed/dev-user-token';
import { DEV_USER } from '../../../../seed/dev-user';
import * as seeds from '../../../../seed/seeds';

import { startTestServer } from '../../../../testing/utils';

import { Organization } from '../../organization.entity';

describe('[e2e] /organizations/:name/owners', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let organization: Organization;

  beforeAll(async () => {
    request = await startTestServer();
    token = devUserToken();
  });

  beforeAll(async () => {
    const payload = seeds.organization();

    const res = await request.post('/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);

    organization = res.body.data;
  });

  describe('find', () => {
    it('should find owners', (done) => {
      request.get(`/organizations/${organization.name}/owners`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data).toEqual([{
            _id: DEV_USER._id,
            image: DEV_USER.image,
            username: DEV_USER.username,
            email: DEV_USER.email,
          }]);
        })
        .end(done);
    });
  });

  describe('update', () => {
    it('should remove owner', (done) => {
      request.put(`/organizations/${organization.name}/owners`)
        .set('Authorization', `Bearer ${token}`)
        .send({ username: DEV_USER.username })
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.owners).toEqual([]);
          expect(isValid(Date.parse(body.data.updatedAt))).toBe(true);
        })
        .end(done);
    });
  });
});
