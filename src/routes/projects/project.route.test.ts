import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { isValid } from 'date-fns';

import { devUserToken } from '../../seed/dev-user-token';

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

  describe('find', () => {
    it('find projects', (done) => {
      request.get('/projects')
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data).toHaveLength(1);
        })
        .end(done);
    });
  });

  describe('findOne', () => {
    it('should not find project', (done) => {
      request.get('/projects/test')
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find one project', (done) => {
      request.get(`/projects/${proj.name}`)
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
