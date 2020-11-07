import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

import { devUserToken } from '../../seed/dev-user-token';
import { DEV_USER } from '../../seed/dev-user';
import { startTestServer } from '../../testing/utils';

describe('[e2e] /users', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;

  beforeAll(async () => {
    request = await startTestServer();
    token = devUserToken();
  });

  describe('login', () => {
    it('should not find user', (done) => {
      request.post('/users/login')
        .send({ email: 'test@dev.com' })
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should login', (done) => {
      request.post('/users/login')
        .send({ email: 'dev@dev.com' })
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.user).toBeDefined();
          expect(body.data.token).toBeDefined();
        })
        .end(done);
    });
  });

  describe('find', () => {
    it('should find user', (done) => {
      request.get('/users')
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

  describe('findOne', () => {
    it('should not find user', (done) => {
      request.get(`/users/1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one user', (done) => {
      request.get(`/users/${DEV_USER._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data._id).toEqual(DEV_USER._id);
        })
        .end(done);
    });
  });

  describe('update', () => {
    it('should not find user', (done) => {
      request.put('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'devtest' })
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should update user', (done) => {
      request.put(`/users/${DEV_USER._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'devtest' })
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data._id).toEqual(DEV_USER._id);
          expect(body.data.firstName).toEqual('devtest');
        })
        .end(done);
    });
  });

  describe('remove', () => {
    it('should not find user', (done) => {
      request.delete(`/users/1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should remove user', (done) => {
      request.delete(`/users/${DEV_USER._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data._id).toEqual(DEV_USER._id);
          expect(isValid(Date.parse(body.data.removedAt))).toBe(true);
        })
        .end(done);
    });
  });
});
