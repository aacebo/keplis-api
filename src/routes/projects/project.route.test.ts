import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

import { devUserToken } from '../../seed/dev-user-token';
import { DEV_USER } from '../../seed/dev-user';

import { startTestServer } from '../../testing/utils';

import { Organization } from '../organizations/organization.entity';
import { organization } from '../organizations/organization.mock';

import { Project } from './project.entity';
import { project } from './project.mock';

describe('[e2e] /projects', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let org: Organization;
  let proj: Project;

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

  describe('create', () => {
    it('should not find organization', (done) => {
      const payload = project();

      request.post(`/organizations/test/projects`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should create project', (done) => {
      const payload = project();

      request.post(`/organizations/${org.name}/projects`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(StatusCodes.CREATED)
        .expect(res => {
          expect(res.body).toBeDefined();
          expect(res.body.data).toMatchObject(payload);
          expect(res.body.data.organization).toEqual(org._id);
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
      request.get(`/organizations/${org.name}/projects`)
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
    it('should not find project', (done) => {
      request.get('/projects/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one project', (done) => {
      request.get(`/projects/${proj.name}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.organization).toEqual(org._id);
          expect(body.data._id).toEqual(proj._id);
        })
        .end(done);
    });
  });

  describe('update', () => {
    it('should not find project', (done) => {
      request.put('/projects/test')
        .set('Authorization', `Bearer ${token}`)
        .send({ displayName: 'test' })
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should update project', (done) => {
      request.put(`/projects/${proj.name}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ displayName: 'test' })
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.organization).toEqual(org._id);
          expect(body.data._id).toEqual(proj._id);
          expect(isValid(Date.parse(body.data.updatedAt))).toBe(true);
        })
        .end(done);
    });
  });

  describe('remove', () => {
    it('should not find project', (done) => {
      request.delete('/projects/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should remove project', (done) => {
      request.delete(`/projects/${proj.name}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data.organization).toEqual(org._id);
          expect(body.data._id).toEqual(proj._id);
          expect(isValid(Date.parse(body.data.removedAt))).toBe(true);
        })
        .end(done);
    });
  });
});
