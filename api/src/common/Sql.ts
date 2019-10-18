import path from 'path';
import { Database, RunResult } from 'sqlite3';
import { enumerateError } from './Enumerator';

export const databaseFilePath = `${path.dirname(__filename)}/../../../assets/nmap.sqlite`;
export const hostsTableName = 'hosts';

export async function run(database: Database, query: string): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    database.run(query, (result: RunResult, error) => {
      if (error) {
        console.log(`An error ocurred while running SQL query: ${JSON.stringify((error), null, 2)}`);
        reject(result);
        return;
      }
      resolve(result);
    });
  });
}
