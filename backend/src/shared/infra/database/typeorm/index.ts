import { config } from 'dotenv';

import {
  createConnection,
  getConnectionOptions,
  Connection,
  ConnectionOptions,
} from 'typeorm';

import HidePost from './entity/HidePost';
import Comment from './entity/Comment';
import Like from './entity/Like';
import Post from './entity/Post';
import User from './entity/User';
import ExternalAuth from './entity/ExternalAuth';
import Token from './entity/Token';
import Notification from './entity/Notification';

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const entities = [
  User,
  HidePost,
  Comment,
  Like,
  Post,
  ExternalAuth,
  Token,
  Notification,
];

const optionsSqlite: ConnectionOptions = {
  type: 'sqlite',
  entities,
  database: './data/line.sqlite',
};

const optionsPostgress: ConnectionOptions = {
  type: 'postgres',
  entities,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as number | undefined,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

const options =
  process.env.NODE_ENV === 'development' ? optionsSqlite : optionsPostgress;

export default async (): Promise<Connection> => {
  try {
    const defaultOptions = await getConnectionOptions();

    return createConnection(Object.assign(defaultOptions, options));
  } catch (error) {
    return error;
  }
};
