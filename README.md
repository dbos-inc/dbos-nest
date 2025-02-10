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

Finally, the service layer is where the DBOS workflows are defined:

```typescript
// app.service.ts
import { Injectable } from "@nestjs/common";
import { DBOS } from "@dbos-inc/dbos-sdk";

@Injectable()
export class AppService {
  @DBOS.workflow()
  static async getHello() {
    DBOS.logger.info("Hello from a wf");
    return "Hello DBOS!";
  }
}
```
