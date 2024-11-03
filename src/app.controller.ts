import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DBOSService } from './dbos.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly DBOSService: DBOSService) {}

  @Get()
  async getHello(): Promise<string> {
    const dbos = this.DBOSService.getDBOSExecutor();
    const response = await dbos.workflow(AppService.getHello, {});
    return response.getResult();
  }
}
