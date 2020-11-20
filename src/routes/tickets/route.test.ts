import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

import { devUserToken } from '../../seed/dev-user-token';
import { DEV_USER } from '../../seed/dev-user';
import * as seeds from '../../seed/seeds';

import { startTestServer } from '../../testing/utils';

import { Organization } from '../organizations/organization.entity';
import { Project } from '../projects/project.entity';

import { Ticket } from './ticket.entity';

describe('[e2e] /organizations/:orgName/projects/:projectName/tickets', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let organization: Organization;
  let project: Project;
  let ticket: Ticket;

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

  beforeAll(async () => {
    const payload = seeds.project();

    const res = await request.post(`/organizations/${organization.name}/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);

    project = res.body.data;
  });

  beforeAll(async () => {
    const payload = seeds.ticket();
    delete payload.status;

    const res = await request.post(`/organizations/${organization.name}/projects/${project.name}/tickets`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);

    ticket = res.body.data;
  });

  describe('create', () => {
    it('should not find organization', (done) => {
      const payload = seeds.ticket();
      delete payload.status;

      request.post(`/organizations/test/projects/${project.name}/tickets`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find project', (done) => {
      const payload = seeds.ticket();
      delete payload.status;

      request.post(`/organizations/${organization.name}/projects/test/tickets`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should create ticket', (done) => {
      const payload = seeds.ticket();
      delete payload.status;

      request.post(`/organizations/${organization.name}/projects/${project.name}/tickets`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.CREATED)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toMatchObject(payload);
          expect(res.body.data.project).toEqual(project._id);
          expect(res.body.data.createdBy._id).toEqual(DEV_USER._id);
        })
        .end(done);
    });
  });

  describe('find', () => {
    it('should not find organization', (done) => {
      request.get(`/organizations/test/projects/${project.name}/tickets`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find project', (done) => {
      request.get(`/organizations/${organization.name}/projects/test/tickets`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find tickets', (done) => {
      request.get(`/organizations/${organization.name}/projects/${project.name}/tickets`)
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
      request.get(`/organizations/test/projects/${project.name}/tickets/${ticket.number}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find project', (done) => {
      request.get(`/organizations/${organization.name}/projects/test/tickets/${ticket.number}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find ticket', (done) => {
      request.get(`/organizations/${organization.name}/projects/${project.name}/tickets/5000`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one ticket', (done) => {
      request.get(`/organizations/${organization.name}/projects/${project.name}/tickets/${ticket.number}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.project).toEqual(project._id);
          expect(body.data._id).toEqual(ticket._id);
        })
        .end(done);
    });
  });

  describe('update', () => {
    it('should not find organization', (done) => {
      request.put(`/organizations/test/projects/${project.name}/tickets/${ticket.number}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'test' })
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find project', (done) => {
      request.put(`/organizations/${organization.name}/projects/test/tickets/${ticket.number}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'test' })
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find ticket', (done) => {
      request.put(`/organizations/${organization.name}/projects/${project.name}/tickets/5000`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'test' })
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should update ticket', (done) => {
      request.put(`/organizations/${organization.name}/projects/${project.name}/tickets/${ticket.number}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'test' })
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.project).toEqual(project._id);
          expect(body.data._id).toEqual(ticket._id);
          expect(isValid(Date.parse(body.data.updatedAt))).toBe(true);
        })
        .end(done);
    });
  });

  describe('remove', () => {
    it('should not find organization', (done) => {
      request.delete(`/organizations/test/projects/${project.name}/tickets/${ticket.number}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find project', (done) => {
      request.delete(`/organizations/${organization.name}/projects/test/tickets/${ticket.number}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find ticket', (done) => {
      request.delete(`/organizations/${organization.name}/projects/${project.name}/tickets/5000`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should remove ticket', (done) => {
      request.delete(`/organizations/${organization.name}/projects/${project.name}/tickets/${ticket.number}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.project).toEqual(project._id);
          expect(body.data._id).toEqual(ticket._id);
          expect(isValid(Date.parse(body.data.removedAt))).toBe(true);
        })
        .end(done);
    });
  });
});
