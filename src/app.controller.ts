import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DBOS } from '@dbos-inc/dbos-sdk';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const response = await DBOS.workflow(AppService.getHello, {});
    return response.getResult();
  }
}
