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
