import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

import { devUserToken } from '../../seed/dev-user-token';

import { startTestServer } from '../../testing/utils';

import { Organization } from '../organizations/organization.entity';
import { organization } from '../organizations/organization.mock';

import { Project } from '../projects/project.entity';
import { project } from '../projects/project.mock';

import { Ticket } from '../tickets/ticket.entity';
import { ticket } from '../tickets/ticket.mock';

import { Comment } from './comment.entity';
import { comment } from './comment.mock';

describe('[e2e] /comments', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let org: Organization;
  let proj: Project;
  let tkt: Ticket;
  let cmt: Comment;

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

  beforeAll(async () => {
    const payload = project();

    const res = await request.post(`/organizations/${org.name}/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);

    proj = res.body.data;
  });

  beforeAll(async () => {
    const payload = ticket();
    delete payload.status;

    const res = await request.post(`/projects/${proj.name}/tickets`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);

      tkt = res.body.data;
  });

  beforeAll(async () => {
    const payload = comment();

    const res = await request.post(`/tickets/${tkt.number}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);

      cmt = res.body.data;
  });

  describe('find', () => {
    it('find comments', (done) => {
      request.get('/comments')
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data).toHaveLength(1);
        })
        .end(done);
    });
  });

  describe('findOne', () => {
    it('should not find comment', (done) => {
      request.get('/comments/test')
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one comment', (done) => {
      request.get(`/comments/${cmt._id}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.ticket).toEqual(tkt._id);
          expect(body.data._id).toEqual(cmt._id);
        })
        .end(done);
    });
  });

  describe('update', () => {
    it('should not find comment', (done) => {
      request.put('/comments/test')
        .set('Authorization', `Bearer ${token}`)
        .send({ body: 'test' })
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should update comment', (done) => {
      request.put(`/comments/${cmt._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ body: 'test' })
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.body).toEqual('test');
          expect(body.data.ticket).toEqual(tkt._id);
          expect(body.data._id).toEqual(cmt._id);
          expect(isValid(Date.parse(body.data.updatedAt))).toBe(true);
        })
        .end(done);
    });
  });

  describe('remove', () => {
    it('should not find comment', (done) => {
      request.delete('/comments/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should remove comment', (done) => {
      request.delete(`/comments/${cmt._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.ticket).toEqual(tkt._id);
          expect(body.data._id).toEqual(cmt._id);
          expect(isValid(Date.parse(body.data.removedAt))).toBe(true);
        })
        .end(done);
    });
  });
});
