import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { exit } from 'process';

dotenv.config({ path: '.env.local' });

import Logger from '../core/logger';

import { OrganizationModel, organization } from '../routes/organizations';
import { UserModel, user } from '../routes/users';
import { ProjectModel, project } from '../routes/projects';
import { TicketModel, ticket } from '../routes/tickets';
import { CommentModel, comment } from '../routes/comments';

import { DEV_USER } from './dev-user';
import { Seeder } from './seeder';

const seeder = new Seeder();

async function start(count: number) {
  Logger.info('starting seed process...');

  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    for (const name in mongoose.connection.collections) {
      Logger.info(`deleting all ${name}...`);
      await mongoose.connection.collections[name].deleteMany({ });
    }

    Logger.info(`creating users(${count})...`);

    const devUser = new UserModel(DEV_USER);
    seeder.set(devUser._id, 'users');
    await devUser.save();

    for (let i = 0; i < count - 1; i++) {
      const v = new UserModel(user({ _id: uuid.v4() }));
      seeder.set(v._id, 'users');
      await v.save();
    }

    Logger.info(`creating organizations(${count})...`);

    for (let i = 0; i < count; i++) {
      const createdBy = seeder.get('users');
      const v = new OrganizationModel(organization({
        _id: uuid.v4(),
        owners: [createdBy],
        createdBy,
      }));

      seeder.set(v._id, 'organizations');
      await v.save();
    }

    count *= 5;
    Logger.info(`creating projects(${count})...`);

    for (let i = 0; i < count; i++) {
      const v = new ProjectModel(project({
        _id: uuid.v4(),
        organization: seeder.get('organizations'),
        createdBy: seeder.get('users'),
      }));

      const o = await OrganizationModel.findById(v.organization);
      o.projects.push(v._id);

      seeder.set(v._id, 'projects');
      await v.save();
      await o.save();
    }

    count *= 5;
    Logger.info(`creating tickets(${count})...`);

    for (let i = 0; i < count; i++) {
      const p = await ProjectModel.findById(seeder.get('projects'));
      const v = new TicketModel(ticket({
        _id: uuid.v4(),
        organization: p.organization,
        project: p._id,
        createdBy: seeder.get('users'),
      }));

      p.tickets.push(v._id);

      seeder.set(v._id, 'tickets');
      await v.save();
      await p.save();
    }

    count *= 5;
    Logger.info(`creating comments(${count})...`);

    for (let i = 0; i < count; i++) {
      const v = new CommentModel(comment({
        _id: uuid.v4(),
        ticket: seeder.get('tickets'),
        likes: [seeder.get('users')],
        createdBy: seeder.get('users'),
      }));

      const t = await TicketModel.findById(v.ticket);
      t.comments.push(v._id);

      seeder.set(v._id, 'comments');
      await v.save();
      await t.save();
    }

    Logger.info(`finished seeding ${seeder.count} entities in ${seeder.elapse}`);
    exit(0);
  } catch (e) {
    Logger.error(e);
    exit(1);
  }
}

start(+process.argv[process.argv.indexOf('-c') + 1] || 100);
