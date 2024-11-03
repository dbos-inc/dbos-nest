import { Injectable } from '@nestjs/common';
import { Workflow, WorkflowContext } from '@dbos-inc/dbos-sdk';

@Injectable()
export class AppService {
  @Workflow()  // Run this function as a database transaction
  static async getHello(ctxt: WorkflowContext) {
    console.log('Hello from a wf');
    ctxt.logger.info('Hello from a wf');
    return 'Hello DBOS!';
  }
}
