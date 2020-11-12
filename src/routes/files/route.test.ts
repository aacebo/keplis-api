import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { devUserToken } from '../../seed/dev-user-token';
import { startTestServer } from '../../testing/utils';

describe('[e2e] /files', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let file: string;

  beforeAll(async () => {
    request = await startTestServer();
    token = devUserToken();
  });

  beforeAll(async () => {
    const res = await request.post('/files')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('test'), 'test.txt')
      .expect(StatusCodes.CREATED);

    file = res.body.data.url;
  });

  describe('create', () => {
    it('should create file', (done) => {
      request.post('/files')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('test'), 'test.txt')
        .expect(StatusCodes.CREATED)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(typeof body.data.url).toEqual('string');
        })
        .end(done);
    });
  });

  describe('findOne', () => {
    it('should not find one', (done) => {
      request.get('/files/1')
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one', (done) => {
      request.get(`/files/${file.slice(file.lastIndexOf('/') + 1, file.length)}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
        })
        .end(done);
    });
  });
});
