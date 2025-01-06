import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { context, propagation, trace } from '@opentelemetry/api';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TODO_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('DB_SERVICE_HOST'),
            port: configService.get('DB_SERVICE_PORT'),
            serializer: {
              serialize: (value: any) => {
                const currentSpan = trace.getSpan(context.active());
                const carrier: Record<string, string> = {};
                if (currentSpan) {
                  propagation.inject(context.active(), carrier);
                }
                // 确保 carrier 中的所有值都是字符串
                const safeCarrier = Object.fromEntries(
                  Object.entries(carrier).map(([k, v]) => [k, String(v)])
                );
                return JSON.stringify({
                  data: value,
                  traceContext: safeCarrier
                });
              }
            }
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
