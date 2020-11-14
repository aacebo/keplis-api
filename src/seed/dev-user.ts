import { user } from './seeds/user.seed';

export const DEV_USER = user({
  _id: '436452e6-ae48-4628-a0f1-00285d1b05c3',
  firstName: 'dev',
  lastName: 'user',
  username: 'dev-user',
  email: 'dev@dev.com',
});
