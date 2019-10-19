import { MappedPort } from "./MappedPort";

export interface ParsedTableHost {
  address: string;
  status: string;
  scanStart: number;
  hostnames: string[];
  ports: MappedPort[];
}
