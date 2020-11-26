import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { devUserToken } from '../../../../seed/dev-user-token';
import { DEV_USER } from '../../../../seed/dev-user';

import { startTestServer } from '../../../../testing/utils';

import { Organization } from '../../../organizations/organization.entity';
import { organization } from '../../../organizations/organization.mock';

import { Project } from '../../../projects/project.entity';
import { project } from '../../../projects/project.mock';

import { ticket } from '../../../tickets/ticket.mock';

describe('[e2e] /users/:username/tickets', () => {
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

  beforeAll(async () => {
    const payload = ticket();
    delete payload.status;

    await request.post(`/projects/${proj.name}/tickets`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(StatusCodes.CREATED);
  });

  describe('find', () => {
    it('should not find user', (done) => {
      request.get('/users/test/tickets')
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should find tickets', (done) => {
      request.get(`/users/${DEV_USER.username}/tickets`)
        .set('Authorization', `Bearer ${token}`)
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data).toHaveLength(1);
        })
        .end(done);
    });
  });
});
