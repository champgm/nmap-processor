import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import expressBunyanLogger from 'express-bunyan-logger';
import morgan from 'morgan';
import sqlite3, { Database } from 'sqlite3';

import { databaseFilePath, hostsTableName } from './common/Sql';
import { NmapRouter } from './routing/NmapRouter';
import { StaticRouter } from './routing/StaticRouter';
import { XmlHandler } from './handlers/XmlHandler';

export const expressApp = express();
expressApp.use(morgan('common'));
expressApp.use(bodyParser.json() as any);
expressApp.use(bodyParser.urlencoded({ extended: true }) as any);
expressApp.use(compression());

sqlite3.verbose();
const database: Database = new sqlite3.Database(databaseFilePath);
process.on('SIGINT', () => database.close());
process.on('exit', () => database.close());
prepareDatabase(database).then(() => {
  const xmlHandler: XmlHandler = new XmlHandler(database);

  expressApp.use(new StaticRouter().init().getRouter());
  expressApp.use(new NmapRouter(xmlHandler, express.Router()).init().getRouter());

  expressApp.use(expressBunyanLogger.errorLogger());
});

async function listTables() { }

async function prepareDatabase(database: Database) {
  const tableCreate = `create table if not exists ${hostsTableName} (` +
    'address text primary key, ' +
    'status text,' +
    'scanStart integer,' +
    'jsonHostnames text,' +
    'jsonPorts text' +
    ');';
  database.serialize(() => {
    database.run(tableCreate);
    database.all("select * from sqlite_master where type='table'", (err, tables) => {
      console.log(`Tables available in database: ${JSON.stringify(tables, null, 2)}`);
    });
  });
}
