import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { exit } from 'process';
import { formatDistanceToNow } from 'date-fns';

import { UserModel } from '../src/routes';
import Logger from '../src/core/logger';

import * as seeds from './seeds';
import { DEV_USER } from './dev-user';

dotenv.config({ path: '.env.local' });

async function start(count: number) {
  const start = new Date();
  const userIds: string[] = [];
  let entities = 1;

  Logger.info('creating fixtures...');

  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

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

    Logger.info(`finished seeding ${entities} entities in ${formatDistanceToNow(start)}`);
    exit(0);
  } catch (e) {
    Logger.error(e);
    exit(1);
  }
}

start(+process.argv[process.argv.indexOf('-c') + 1] || 100);
