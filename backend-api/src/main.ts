import './tracer';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TraceInterceptor } from './common/interceptors/trace.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new TraceInterceptor());
  await app.listen(3001);
}
bootstrap();
