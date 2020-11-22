import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { exit } from 'process';

dotenv.config({ path: '.env.local' });

import Logger from '../core/logger';

import { OrganizationModel, organization } from '../routes/organizations';
import { UserModel } from '../routes/users';
import { ProjectModel } from '../routes/projects';
import { TicketModel } from '../routes/tickets';

import * as seeds from './seeds';
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
      const user = new UserModel(seeds.user({ _id: uuid.v4() }));
      seeder.set(user._id, 'users');
      await user.save();
    }

    Logger.info(`creating organizations(${count})...`);

    for (let i = 0; i < count; i++) {
      const createdBy = seeder.get('users');
      const org = new OrganizationModel(organization({
        _id: uuid.v4(),
        owners: [createdBy],
        createdBy,
      }));

      seeder.set(org._id, 'organizations');
      await org.save();
    }

    Logger.info(`creating projects(${count})...`);

    for (let i = 0; i < count; i++) {
      const project = new ProjectModel(seeds.project({
        _id: uuid.v4(),
        organization: seeder.get('organizations'),
        createdBy: seeder.get('users'),
      }));

      seeder.set(project._id, 'projects');
      await project.save();
    }

    Logger.info(`creating tickets(${count})...`);

    for (let i = 0; i < count; i++) {
      const ticket = new TicketModel(seeds.ticket({
        _id: uuid.v4(),
        project: seeder.get('projects'),
        createdBy: seeder.get('users'),
      }));

      seeder.set(ticket._id, 'tickets');
      await ticket.save();
    }

    Logger.info(`finished seeding ${seeder.count} entities in ${seeder.elapse}`);
    exit(0);
  } catch (e) {
    Logger.error(e);
    exit(1);
  }
}

start(+process.argv[process.argv.indexOf('-c') + 1] || 100);
