import { ParsedTableHost } from "./ParsedTableHost";

const get = {
  method: "GET",
  json: true,
}

export class HostsApi {
  async getAllAddresses(): Promise<string[]> {
    try {
      const uri = `addresses/`;
      const fetchResult = await fetch(uri, get);
      console.log(`fetchResult${JSON.stringify(fetchResult, null, 2)}`);
      const addresses: string[] = await fetchResult.json();
      console.log(`Retrieved addresses:${JSON.stringify(addresses, null, 2)}`);
      return addresses.sort();
    } catch (error) {
      console.log(`Unable to retrieve addresses: ${error}`);
      return [
        'No Hosts Found',
      ];
    }
  }

  async getHost(address: string): Promise<ParsedTableHost> {
    const uri = `addresses/${address}`;
    const host: ParsedTableHost = await (await fetch(uri, get)).json();
    host.hostnames = host.hostnames.sort();
    return host;
  }
}