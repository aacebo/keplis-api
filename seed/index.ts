import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as faker from 'faker';

import { exit } from 'process';
import { formatDistanceToNow } from 'date-fns';

import { OrganizationModel, UserModel } from '../src/routes';
import Logger from '../src/core/logger';

import * as seeds from './seeds';
import { DEV_USER } from './dev-user';

dotenv.config({ path: '.env.local' });

async function start(count: number) {
  const start = new Date();
  const userIds: string[] = [];
  let entities = 1;

  const getRandomUserId = () => {
    return userIds[faker.random.number({ min: 0, max: userIds.length - 1 })];
  }

  Logger.info('creating fixtures...');

  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    await OrganizationModel.deleteMany({ });;
    await UserModel.deleteMany({ });

    Logger.info(`creating users(${count})...`);

    const devUser = new UserModel(DEV_USER);
    await devUser.save();
    userIds.push(devUser._id);

    for (let i = 0; i < count - 1; i++, entities++) {
      const user = new UserModel(seeds.user());
      await user.save();
      userIds.push(user._id);
    }

    Logger.info(`creating organizations(${count})...`);

    for (let i = 0; i < count; i++, entities++) {
      const organization = new OrganizationModel(seeds.organization({ createdBy: getRandomUserId() }));
      await organization.save();
    }

    Logger.info(`finished seeding ${entities} entities in ${formatDistanceToNow(start)}`);
    exit(0);
  } catch (e) {
    Logger.error(e);
    exit(1);
  }
}

start(+process.argv[process.argv.indexOf('-c') + 1] || 100);
