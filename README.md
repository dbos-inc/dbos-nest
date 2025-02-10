# Nest x DBOS

This Sample app shows how to use DBOS workflows with a nest.js app following the controller/service/module.

First, configure main.ts to start DBOS (optionally register the nest application to attach the DBOS tracing middlewares):

```typescript
// main.ts
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { DBOS } from "@dbos-inc/dbos-sdk";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  await DBOS.launch({ nestApp: app });
  await app.listen(8000);
}

bootstrap();
```

The `app.module` is unchange and simply register the controller and service:

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
```

The controller simply expose one endpoint that calls the service:

```typescript
// app.controller.ts
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    return AppService.getHello();
  }
}
```

Finally, the service layer is where the DBOS workflows are defined. Here's an example of a workflow with two steps, one of which is a DB transaction:

```typescript
// app.service.ts
import { AppService } from "./app.service";

import { Injectable } from "@nestjs/common";
import { DBOS } from "@dbos-inc/dbos-sdk";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const config: Config = {
  dictionaries: [adjectives, colors, animals], // Order of dictionaries
  separator: '-',
  length: 2,
  style: 'capital', // Capitalizes each word
};

interface GreetingRecord {
  greeting_name: string;
  greeting_note_content: string;
}

@Injectable()
export class AppService {
  @DBOS.workflow()
  static async getHello() {
    DBOS.logger.info("Hello from a wf");
    await AppService.sendhttprequest();
    await AppService.insert();
    return "Hello World!";
  }

  @DBOS.step()
  static async sendhttprequest() {
    const response = await fetch("https://example.com");
    const data = await response.text();
    return data;
  }

  @DBOS.transaction()
  static async insert(): Promise<GreetingRecord> {
       const randomName: string = uniqueNamesGenerator(config);
      return DBOS.knexClient<GreetingRecord>("dbos_greetings").insert(
          { greeting_name: randomName, greeting_note_content: "Hello World!" },
      );
  }
}
```
