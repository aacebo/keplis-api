import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { devUserToken } from '../../seed/dev-user-token';
import { DEV_USER } from '../../seed/dev-user';
import * as seeds from '../../seed/seeds';

import { startTestServer } from '../../testing/utils';

import { Organization } from './organization.entity';

describe('[e2e] /organizations', () => {
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

  describe('create', () => {
    it('should create organization', (done) => {
      const payload = seeds.organization();

      request.post('/organizations')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.CREATED)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toMatchObject(payload);
          expect(res.body.data.createdBy._id).toEqual(DEV_USER._id);
        })
        .end(done);
    });
  });

  describe('find', () => {
    it('should find organizations', (done) => {
      request.get('/organizations')
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.user).toBeDefined();
          expect(body.meta).toBeDefined();
          expect(body.links).toBeDefined();
          expect(body.data.length).toEqual(2);
        })
        .end(done);
    });
  });

  describe('findOne', () => {
    it('should not find organization', (done) => {
      request.get('/organizations/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one organization', (done) => {
      request.get(`/organizations/${organization._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data._id).toEqual(organization._id);
        })
        .end(done);
    });
  });
});
