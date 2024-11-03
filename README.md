# Nest x DBOS

This PoC is built on the simple idea of exposing the DBOSExecutor from the DBOS SDK, to programmers. At a high level, the programmer is responsible for initializing the DBOS executor, which will then run in the background and "do its stuff".

Following, the nest.js quick start, this looks as follow:

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DBOSService } from './dbos.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const dbos = app.get(DBOSService);
    await dbos.init();
    await app.listen(8000);
}

bootstrap();
```

The DBOSService is a class that will be responsible for initializing the DBOS executor and making it available to the application.

```typescript
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
```

Following nest.js conventions, the DBOS service is made available to the application as a provider:

```typescript
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
```

And used in controllers (nest.js layer responsible for handling HTTP requests) like this:

```typescript
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
```

At the service layer, normal TypeScript code can be made DBOS workflows as follows:

```typescript
// app.service.ts
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
```

