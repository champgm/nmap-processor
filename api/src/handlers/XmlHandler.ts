import { MappedPort } from '../interfaces/Mapped';
import * as bunyan from 'bunyan';
import * as DotEnv from 'dotenv';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';
import { enumerateError } from '../common/Enumerator';
import { ParsedNmap, Port } from '../interfaces/ParsedNmap';
import { Database } from 'sqlite3';
import { hostsTableName } from '../common/Sql';

const bunyanLogger = bunyan.createLogger({
  name: `${path.basename(__filename)}`,
});

export class XmlHandler {
  constructor(private database: Database) { }

  async  handle(
    request: Request,
    response: Response,
    nextFunction: NextFunction,
  ) {
    const fileBuffer: Buffer = (request as any).file.buffer;
    if (fileBuffer) {
      bunyanLogger.info({
        body: request.body,
        headers: request.headers,
        request,
      }, 'Received XML file request');

      // Parse the XML
      let parsedNmap: ParsedNmap;
      try {
        parsedNmap = await this.parseNmap(fileBuffer);
      } catch (error) {
        const context = {
          message: 'Unable to parse incoming file',
          error: enumerateError(error),
        };
        bunyanLogger.error(context, context.message);
        response.status(400).send(context);
      }

      // Insert rows into table
      parsedNmap.nmaprun.host.forEach((nmapHost) => {
        nmapHost.address.forEach((address) => {
          try {
            const insertQuery = `INSERT OR REPLACE INTO ${hostsTableName} values (` +
              `'${address.$.addr}',` +
              `'${nmapHost.status[0].$.state}',` +
              `${nmapHost.$.starttime},` +
              `'${JSON.stringify(this.getHostNames(nmapHost.hostnames))}',` +
              `'${JSON.stringify(this.getPorts(nmapHost.ports))}'` +
              ');';
            console.log(`insert query: ${insertQuery}`);
            this.database.run(insertQuery);
          } catch (error) {
            const context = {
              nmapHost,
              message: 'Could not execute insert query for host',
              error: enumerateError(error),
            };
            bunyanLogger.error(context, context.message);
            throw error;
          }
        });
      });
      response.status(202).send();
    } else {
      const context = { message: 'File not found in request' };
      bunyanLogger.error(context, context.message);
      response.status(400).send(context);
    }
  }

  getHostNames(hostNames: { hostname: { $: { name: string, type: string } }[] }[]): string[] {
    const allNames: string[] = [];
    hostNames.forEach((hostnameObject) => {
      if (hostnameObject && hostnameObject.hostname) {
        hostnameObject.hostname.forEach((hostname) => {
          allNames.push(hostname.$.name);
        });
      }
    });
    return allNames;
  }

  getPorts(ports: Port[]): MappedPort[] {
    const mappedPorts: MappedPort[] = [];
    ports.forEach((portContainer) => {
      portContainer.port.forEach((port) => {
        mappedPorts.push({
          protocol: port.$.protocol,
          state: port.state[0].$.state,
          service: port.service[0].$.name,
          number: port.$.portid,
        });
      });
    });
    return mappedPorts;
  }

  async  parseNmap(fileBuffer: Buffer): Promise<ParsedNmap> {
    const fileContents = fileBuffer.toString('utf8');
    const parsedNmap = await parseStringPromise(fileContents);
    bunyanLogger.info({
      fileContents,
      nmap: parsedNmap,
    }, 'Successfully parsed XML file');
    return parsedNmap;
  }

  next(nextFunction: NextFunction, input: any) {
    if (nextFunction) {
      nextFunction(input);
    }
  }

}

// export async function xmlHandler(
//   request: Request,
//   response: Response,
//   nextFunction: NextFunction,
// ) {
//   const fileBuffer: Buffer = (request as any).file.buffer;
//   if (fileBuffer) {
//     bunyanLogger.info({
//       body: request.body,
//       headers: request.headers,
//       request,
//     }, 'Received XML file request');

//     // Parse the XML
//     let parsedNmap: ParsedNmap;
//     try {
//       parsedNmap = await parseNmap(fileBuffer);
//     } catch (error) {
//       const context = {
//         message: 'Unable to parse incoming file',
//         error: enumerateError(error),
//       };
//       bunyanLogger.error(context, context.message);
//       response.status(400).send(context);
//     }

// // Open the SQL database

//     // Store in sqlite
//   } else {
//     const context = { message: 'File not found in request' };
//     bunyanLogger.error(context, context.message);
//     response.status(400).send(context);
//   }
// }

// async function parseNmap(fileBuffer: Buffer): Promise<ParsedNmap> {
//   const fileContents = fileBuffer.toString('utf8');
//   const parsedNmap = await parseStringPromise(fileContents);
//   bunyanLogger.info({
//     fileContents,
//     nmap: parsedNmap,
//   }, 'Successfully parsed XML file');
//   return parsedNmap;
// }

// function next(nextFunction: NextFunction, input: any) {
//   if (nextFunction) {
//     nextFunction(input);
//   }
// }
