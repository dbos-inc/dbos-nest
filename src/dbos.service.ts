// dbos.service.ts
import { Injectable } from '@nestjs/common';
import {
  DBOSExecutor,
  DBOSConfig,
  DBOSRuntimeConfig,
  parseConfigFile,
} from '@dbos-inc/dbos-sdk';

// This can be made more generic by using a custom DBOS event receiver?
// Instead of manually returning the executor?
@Injectable()
export class DBOSService {
  private dbos: DBOSExecutor | null = null;

  constructor() {
      console.log("built DBOSService");
  }

  async init() {
    // Parse configuration and initialize DBOSExecutor
    const [dbosConfig, _]: [DBOSConfig, DBOSRuntimeConfig] = parseConfigFile();
    this.dbos = new DBOSExecutor(dbosConfig);
    await this.dbos.init();
  }

  getDBOSExecutor(): DBOSExecutor {
    if (!this.dbos) {
        throw new Error('DBOS Executor not initialized');
    }
    return this.dbos;
  }
}

