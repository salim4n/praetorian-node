declare module 'node-ssdp' {
    import { EventEmitter } from 'events';
  
    export class Client extends EventEmitter {
      constructor(opts?: ClientOptions);
      search(serviceType: string): void;
    }
  
    export interface ClientOptions {
      ssdpSig?: string;
      ssdpIp?: string;
      ssdpPort?: number;
      ssdpTtl?: number;
      headers?: { [key: string]: string };
    }
  }
  