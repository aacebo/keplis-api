import * as jwt from 'jsonwebtoken';

import { DEV_USER } from './dev-user';

export function devUserToken() {
  return jwt.sign({
    id: DEV_USER._id,
    email: DEV_USER.email,
  }, process.env.SECRET);
}
