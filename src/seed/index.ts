import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as uuid from 'uuid';

import { exit } from 'process';
import { formatDistanceToNow } from 'date-fns';

dotenv.config({ path: '.env.local' });

import { OrganizationModel, UserModel, ProjectModel } from '../routes';
import Logger from '../core/logger';

import * as seeds from './seeds';
import { DEV_USER } from './dev-user';

async function start(count: number) {
  const start = new Date();
  const userIds: string[] = [];
  let entities = 1;

  const getRandomNumber = (max: number) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const getRandomUserId = () => {
    return userIds[getRandomNumber(userIds.length)];
  }

  Logger.info('starting seed process...');

  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    for (const name in mongoose.connection.collections) {
      Logger.info(`deleting all ${name}...`);
      await mongoose.connection.collections[name].deleteMany({ });
    }

    Logger.info(`creating users(${count})...`);

    const devUser = new UserModel(DEV_USER);
    userIds.push(devUser._id);
    await devUser.save();

    for (let i = 0; i < count - 1; i++, entities++) {
      const user = new UserModel(seeds.user({ _id: uuid.v4() }));
      userIds.push(user._id);
      await user.save();
    }

    Logger.info(`creating organizations(${count})...`);

    for (let i = 0; i < count; i++, entities++) {
      const createdBy = getRandomUserId();
      const organization = new OrganizationModel(seeds.organization({
        _id: uuid.v4(),
        owners: [createdBy],
        createdBy,
      }));

      await organization.save();
    }

    Logger.info(`creating projects(${count})...`);

    for (let i = 0; i < count; i++, entities++) {
      const createdBy = getRandomUserId();
      const project = new ProjectModel(seeds.project({
        _id: uuid.v4(),
        createdBy,
      }));

      await project.save();
    }

    Logger.info(`finished seeding ${entities} entities in ${formatDistanceToNow(start)}`);
    exit(0);
  } catch (e) {
    Logger.error(e);
    exit(1);
  }
}

start(+process.argv[process.argv.indexOf('-c') + 1] || 100);
