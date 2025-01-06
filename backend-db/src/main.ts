import './tracer';

import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { context, propagation, ROOT_CONTEXT, trace } from '@opentelemetry/api';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3002,
        deserializer: {
          deserialize: (value: any) => {
            try {
              const message = JSON.parse(value);
              if (message.traceContext) {
                const ctx = propagation.extract(ROOT_CONTEXT, message.traceContext);
                // 保持原始消息格式，只添加 context
                message.data.context = ctx;
                return message.data;
              }
              return message;
            } catch (error) {
              console.error('Failed to deserialize message:', error);
              return value;
            }
          }
        }
      },
    },
  );
  await app.listen();
}
bootstrap();
