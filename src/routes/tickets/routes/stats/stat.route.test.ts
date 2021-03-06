import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { devUserToken } from '../../../../seed/dev-user-token';

import { startTestServer } from '../../../../testing/utils';

import { Project } from '../../../projects/project.entity';
import { project } from '../../../projects/project.mock';

import { Organization } from '../../../organizations/organization.entity';
import { organization } from '../../../organizations/organization.mock';

import { ticket } from '../../ticket.mock';
import { Ticket } from '../../ticket.entity';

describe('[e2e] /tickets/stats', () => {
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

  describe('labels', () => {
    it('should get ticket label aggregate', (done) => {
      request.get('/tickets/stats/labels')
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data).toHaveLength(tkt.labels.length);
        })
        .end(done);
    });
  });

  describe('statuses', () => {
    it('should get ticket status aggregate', (done) => {
      request.get('/tickets/stats/statuses')
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data).toHaveLength(1);
        })
        .end(done);
    });
  });

  describe('types', () => {
    it('should get ticket type aggregate', (done) => {
      request.get('/tickets/stats/types')
        .expect(StatusCodes.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.data).toHaveLength(1);
        })
        .end(done);
    });
  });
});
