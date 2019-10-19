
import { Database } from 'sqlite3';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { v4 } from 'uuid';
import * as path from 'path';
import bunyan from 'bunyan';

import { enumerateError } from '../common/Enumerator';
import { hostsTableName } from '../common/Sql';
import { TableHost, ParsedTableHost } from '../interfaces/TableHost';

interface AddressObject {
  address: string;
}

export class RetrievalHandler {
  constructor(private database: Database) { }

  async getAllAddresses(
    request: Request,
    response: Response,
    nextFunction: NextFunction,
  ) {
    const bunyanLogger = bunyan.createLogger({
      name: `${path.basename(__filename)}`,
      transactionId: v4(),
    });
    try {
      this.database.all(`select address from ${hostsTableName}`, (error, addressObjects: AddressObject[]) => {
        if (error) {
          const getAllAddressesError = enumerateError(error);
          bunyanLogger.error(
            { getAllAddressesError },
            'An error ocurred while retrieving all addresses',
          );
          response.status(500).send(getAllAddressesError);
        } else {
          const addresses = addressObjects.map(addressObject => addressObject.address);
          bunyanLogger.info({ addresses, addressObjects }, 'Retrieved all addresses');
          response.status(200).send(addresses);
        }
      });
    } catch (error) {
      const enumeratedError = enumerateError(error);
      bunyanLogger.error({ error: enumeratedError }, 'An unexpected error ocurred');
      response.status(500).send(enumeratedError);
    }
  }

  async getOneHost(
    request: Request,
    response: Response,
    nextFunction: NextFunction,
  ) {
    const address = request.params.address;
    const bunyanLogger = bunyan.createLogger({
      address: address || 'undefined',
      name: `${path.basename(__filename)}`,
      transactionId: v4(),
    });
    try {
      const query = this.database.prepare(`select * from ${hostsTableName} where address = ?`);
      query.all(address, (error, hosts: TableHost[]) => {
        if (error) {
          const getAllAddressesError = enumerateError(error);
          bunyanLogger.error(
            { getAllAddressesError },
            'An error ocurred while retrieving all addresses',
          );
          response.status(500).send(getAllAddressesError);
        } else {
          const host = hosts[0];
          bunyanLogger.info({ host }, 'Retrieved one host');
          const parsedTableHost: ParsedTableHost = {
            address: host.address,
            hostnames: JSON.parse(host.jsonHostnames),
            ports: JSON.parse(host.jsonPorts),
            scanStart: host.scanStart,
            status: host.status,
          };
          bunyanLogger.info({ parsedTableHost }, 'Parsed table host');
          response.status(200).send(parsedTableHost);
        }
      });
    } catch (error) {
      const enumeratedError = enumerateError(error);
      bunyanLogger.error({ error: enumeratedError }, 'An unexpected error ocurred');
      response.status(500).send(enumeratedError);
    }
  }
}
