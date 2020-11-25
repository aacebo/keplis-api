import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

import { devUserToken } from '../../../../seed/dev-user-token';
import { DEV_USER } from '../../../../seed/dev-user';

import { startTestServer } from '../../../../testing/utils';

import { Organization } from '../../../organizations/organization.entity';
import { organization } from '../../../organizations/organization.mock';

describe('[e2e] /organizations/:name/owners', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let org: Organization;

  beforeAll(async () => {
    request = await startTestServer();
    token = devUserToken();
  });

  beforeAll(async () => {
    const payload = organization();

    const res = await request.post('/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);

    org = res.body.data;
  });

  describe('find', () => {
    it('should find owners', (done) => {
      request.get(`/organizations/${org.name}/owners`)
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
      request.put(`/organizations/${org.name}/owners`)
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
