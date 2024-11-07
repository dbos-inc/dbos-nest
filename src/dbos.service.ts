// dbos.service.ts
import { Injectable } from '@nestjs/common';
import { DBOS } from '@dbos-inc/dbos-sdk';

// This can be made more generic by using a custom DBOS event receiver?
// Instead of manually returning the executor?
@Injectable()
export class DBOSService {
  constructor() {
      console.log("built DBOSService");
  }

  async init() {
    await DBOS.launch();
  }

  DBOS() {
    return DBOS.executor;
  }

  async destroy() {
    await DBOS.shutdown();
  }
}

