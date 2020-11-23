import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

import { devUserToken } from '../../seed/dev-user-token';
import { DEV_USER } from '../../seed/dev-user';

import { startTestServer } from '../../testing/utils';

import { Organization } from '../organizations/organization.entity';
import { organization } from '../organizations/organization.mock';

import { Project } from '../projects/project.entity';
import { project } from '../projects/project.mock';

import { Ticket } from '../tickets/ticket.entity';
import { ticket } from '../tickets/ticket.mock';

import { Comment } from './comment.entity';
import { comment } from './comment.mock';

describe('[e2e] /organizations/:orgName/projects/:projectName/tickets/:ticketNumber/comments', () => {
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

    const res = await request.post(`/organizations/${org.name}/projects/${proj.name}/tickets`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);

      tkt = res.body.data;
  });

  beforeAll(async () => {
    const payload = comment();

    const res = await request.post(`/organizations/${org.name}/projects/${proj.name}/tickets/${tkt.number}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);

      cmt = res.body.data;
  });

  describe('create', () => {
    it('should not find organization', (done) => {
      const payload = comment();

      request.post(`/organizations/test/projects/${proj.name}/tickets/${tkt.number}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find project', (done) => {
      const payload = comment();

      request.post(`/organizations/${org.name}/projects/test/tickets/${tkt.number}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find ticket', (done) => {
      const payload = comment();

      request.post(`/organizations/${org.name}/projects/${proj.name}/tickets/5000/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should create comment', (done) => {
      const payload = comment();

      request.post(`/organizations/${org.name}/projects/${proj.name}/tickets/${tkt.number}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.CREATED)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toMatchObject(payload);
          expect(res.body.data.ticket).toEqual(tkt._id);
          expect(res.body.data.createdBy._id).toEqual(DEV_USER._id);
        })
        .end(done);
    });
  });

  describe('find', () => {
    it('should not find organization', (done) => {
      request.get(`/organizations/test/projects/${proj.name}/tickets/${tkt.number}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find project', (done) => {
      request.get(`/organizations/${org.name}/projects/test/tickets/${tkt.number}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find ticket', (done) => {
      request.get(`/organizations/${org.name}/projects/${proj.name}/tickets/5000/comments`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find comments', (done) => {
      request.get(`/organizations/${org.name}/projects/${proj.name}/tickets/${tkt.number}/comments`)
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
    it('should not find comment', (done) => {
      request.get('/comments/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one comment', (done) => {
      request.get(`/comments/${cmt._id}`)
        .set('Authorization', `Bearer ${token}`)
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
