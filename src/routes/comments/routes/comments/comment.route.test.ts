import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { devUserToken } from '../../../../seed/dev-user-token';
import { DEV_USER } from '../../../../seed/dev-user';

import { startTestServer } from '../../../../testing/utils';

import { Organization } from '../../../organizations/organization.entity';
import { organization } from '../../../organizations/organization.mock';

import { Project } from '../../../projects/project.entity';
import { project } from '../../../projects/project.mock';

import { Ticket } from '../../../tickets/ticket.entity';
import { ticket } from '../../../tickets/ticket.mock';

import { Comment } from '../../comment.entity';
import { comment } from '../../comment.mock';

describe('[e2e] /comments/:commentId/comments', () => {
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

  describe('create', () => {
    it('should not find comment', (done) => {
      request.post('/comments/test/comments')
        .set('Authorization', `Bearer ${token}`)
        .send(comment())
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should create comment', (done) => {
      const payload = comment();

      request.post(`/comments/${cmt._id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.CREATED)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data).toMatchObject(payload);
          expect(body.data.createdBy._id).toEqual(DEV_USER._id);
        })
        .end(done);
    });
  });

  describe('find', () => {
    it('should not find comment', (done) => {
      request.get('/comments/test/comments')
        .send(comment())
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find comments', (done) => {
      request.get(`/comments/${cmt._id}/comments`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data).toHaveLength(1);
        })
        .end(done);
    });
  });
});
