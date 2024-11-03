// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBOSService } from './dbos.service';

@Module({
  imports: [],
  providers: [
    AppService,
    DBOSService,
  ],
  controllers: [AppController],
})
export class AppModule {}

