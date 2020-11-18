import * as express from 'express';
import * as supertest from 'supertest';
import * as mongoose from 'mongoose';

import { DEV_USER } from '../../seed/dev-user';
import { startServer } from '../../server';

import { IUserDocument, UserModel } from '../../routes/users/user.entity';

let server: express.Express;
let request: supertest.SuperTest<supertest.Test>;
let devUser: IUserDocument;

export async function startTestServer() {
  if (request) return request;

  server = await startServer();
  request = supertest(server);

  for (const name in mongoose.connection.collections) {
    await mongoose.connection.collections[name].deleteMany({ });
  }

  devUser = new UserModel(DEV_USER);
  await devUser.save();

  return request;
}
