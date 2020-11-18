import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

import { devUserToken } from '../../../../seed/dev-user-token';
import { DEV_USER } from '../../../../seed/dev-user';
import * as seeds from '../../../../seed/seeds';

import { startTestServer } from '../../../../testing/utils';

import { Organization } from '../../organization.entity';
import { Project } from './project.entity';

describe('[e2e] /organizations/:orgName/projects', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let organization: Organization;
  let project: Project;

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

  describe('create', () => {
    it('should not find organization', (done) => {
      const payload = seeds.project();

      request.post(`/organizations/test/projects`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should create project', (done) => {
      const payload = seeds.project();

      request.post(`/organizations/${organization.name}/projects`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.CREATED)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toMatchObject(payload);
          expect(res.body.data.organization).toEqual(organization._id);
          expect(res.body.data.createdBy._id).toEqual(DEV_USER._id);
        })
        .end(done);
    });
  });

  describe('find', () => {
    it('should not find organization', (done) => {
      request.get(`/organizations/test/projects`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find projects', (done) => {
      request.get(`/organizations/${organization.name}/projects`)
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
      request.get(`/organizations/test/projects/${project.name}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find project', (done) => {
      request.get(`/organizations/${organization.name}/projects/test`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one project', (done) => {
      request.get(`/organizations/${organization.name}/projects/${project.name}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.organization).toEqual(organization._id);
          expect(body.data._id).toEqual(project._id);
        })
        .end(done);
    });
  });

  describe('update', () => {
    it('should not find project', (done) => {
      request.put(`/organizations/test/projects/${project.name}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ displayName: 'test' })
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find project', (done) => {
      request.put(`/organizations/${organization.name}/projects/test`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should update project', (done) => {
      request.put(`/organizations/${organization.name}/projects/${project.name}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ displayName: 'test' })
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.organization).toEqual(organization._id);
          expect(body.data._id).toEqual(project._id);
          expect(isValid(Date.parse(body.data.updatedAt))).toBe(true);
        })
        .end(done);
    });
  });

  describe('remove', () => {
    it('should not find project', (done) => {
      request.delete(`/organizations/test/projects/${project.name}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should not find project', (done) => {
      request.delete(`/organizations/${organization.name}/projects/test`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should remove project', (done) => {
      request.delete(`/organizations/${organization.name}/projects/${project.name}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.organization).toEqual(organization._id);
          expect(body.data._id).toEqual(project._id);
          expect(isValid(Date.parse(body.data.removedAt))).toBe(true);
        })
        .end(done);
    });
  });
});
