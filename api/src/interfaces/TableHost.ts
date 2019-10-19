import { MappedPort } from './Mapped';

export interface TableHost {
  address: string;
  status: string;
  scanStart: number;
  jsonHostnames: string;
  jsonPorts: string;
}

export interface ParsedTableHost {
  address: string;
  status: string;
  scanStart: number;
  hostnames: string[];
  ports: MappedPort[];
}
