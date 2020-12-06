import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

import { devUserToken } from '../../seed/dev-user-token';
import { DEV_USER } from '../../seed/dev-user';

import { startTestServer } from '../../testing/utils';

import { Organization } from './organization.entity';
import { organization } from './organization.mock';

describe('[e2e] /organizations', () => {
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

  describe('create', () => {
    it('should create organization', (done) => {
      const payload = organization();

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
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.meta).toBeDefined();
          expect(body.links).toBeDefined();
          expect(body.data.length).toEqual(2);
        })
        .end(done);
    });
  });

  describe('findOne', () => {
    it('should not find organization', (done) => {
      request.get('/organizations/test')
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one organization', (done) => {
      request.get(`/organizations/${org.name}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data._id).toEqual(org._id);
        })
        .end(done);
    });
  });

  describe('update', () => {
    it('should not find organization', (done) => {
      request.put('/organizations/test')
        .set('Authorization', `Bearer ${token}`)
        .send({ displayName: 'test' })
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should update organization', (done) => {
      request.put(`/organizations/${org.name}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ displayName: 'test' })
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data._id).toEqual(org._id);
          expect(isValid(Date.parse(body.data.updatedAt))).toBe(true);
        })
        .end(done);
    });
  });

  describe('remove', () => {
    it('should not find organization', (done) => {
      request.delete(`/organizations/test`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should remove organization', (done) => {
      request.delete(`/organizations/${org.name}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data._id).toEqual(org._id);
          expect(isValid(Date.parse(body.data.removedAt))).toBe(true);
        })
        .end(done);
    });
  });
});
