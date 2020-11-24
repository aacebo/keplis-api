import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

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

describe('[e2e] /comments/:commentId/likes', () => {
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

  describe('update', () => {
    it('should not find comment', (done) => {
      request.put('/comments/test/likes')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should like comment', (done) => {
      request.put(`/comments/${cmt._id}/likes`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.ticket).toEqual(tkt._id);
          expect(body.data.likes[0]._id).toEqual(DEV_USER._id);
          expect(body.data._id).toEqual(cmt._id);
          expect(isValid(Date.parse(body.data.updatedAt))).toBe(true);
        })
        .end(done);
    });

    it('should unlike comment', (done) => {
      request.put(`/comments/${cmt._id}/likes`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.ticket).toEqual(tkt._id);
          expect(body.data.likes.length).toEqual(0);
          expect(body.data._id).toEqual(cmt._id);
          expect(isValid(Date.parse(body.data.updatedAt))).toBe(true);
        })
        .end(done);
    });
  });
});
