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

import { Ticket } from './ticket.entity';
import { ticket } from './ticket.mock';

describe('[e2e] /projects/:projectName/tickets', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let org: Organization;
  let proj: Project;
  let tkt: Ticket;

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

  describe('create', () => {
    it('should not find project', (done) => {
      const payload = ticket();
      delete payload.status;

      request.post('/projects/test/tickets')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should create ticket', (done) => {
      const payload = ticket();
      delete payload.status;

      request.post(`/projects/${proj.name}/tickets`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.CREATED)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toMatchObject(payload);
          expect(res.body.data.project).toEqual(proj._id);
          expect(res.body.data.createdBy._id).toEqual(DEV_USER._id);
        })
        .end(done);
    });
  });

  describe('find', () => {
    it('should not find project', (done) => {
      request.get('/projects/test/tickets')
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find tickets', (done) => {
      request.get(`/projects/${proj.name}/tickets`)
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
    it('should not find ticket', (done) => {
      request.get('/tickets/5000')
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one ticket', (done) => {
      request.get(`/tickets/${tkt.number}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.project).toEqual(proj._id);
          expect(body.data._id).toEqual(tkt._id);
        })
        .end(done);
    });
  });

  describe('update', () => {
    it('should not find ticket', (done) => {
      request.put('/tickets/5000')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'test' })
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should update ticket', (done) => {
      request.put(`/tickets/${tkt.number}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'test' })
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.project).toEqual(proj._id);
          expect(body.data._id).toEqual(tkt._id);
          expect(isValid(Date.parse(body.data.updatedAt))).toBe(true);
        })
        .end(done);
    });
  });

  describe('remove', () => {
    it('should not find ticket', (done) => {
      request.delete('/tickets/5000')
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should remove ticket', (done) => {
      request.delete(`/tickets/${tkt.number}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.project).toEqual(proj._id);
          expect(body.data._id).toEqual(tkt._id);
          expect(isValid(Date.parse(body.data.removedAt))).toBe(true);
        })
        .end(done);
    });
  });
});
