import { ParsedTableHost } from "./ParsedTableHost";

const get = {
  method: "GET",
  json: true,
}

export class HostsApi {
  async getAllAddresses(): Promise<string[]> {
    try {
      const uri = `http://localhost:4200/addresses/`;
      const fetchResult = await fetch(uri, get);
      console.log(`fetchResult${JSON.stringify(fetchResult, null, 2)}`);
      const addresses = await fetchResult.json();
      console.log(`Retrieved addresses:${JSON.stringify(addresses, null, 2)}`);
      return addresses;
    } catch (error) {
      console.log(`Unable to retrieve addresses: ${error}`);
      return ['error'];
    }
  }

  async getHost(address: string): Promise<ParsedTableHost> {
    const uri = `addresses/${address}`;
    const host = await (await fetch(uri, get)).json();
    return host;
  }
}