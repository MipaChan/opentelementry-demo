import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { trace, context } from '@opentelemetry/api';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<any> {
    const span = trace.getTracer('http').startSpan('http_request');
    return new Observable(subscriber => {
      context.with(trace.setSpan(context.active(), span), () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (error) => {
            span.recordException(error);
            span.end();
            subscriber.error(error);
          },
          complete: () => {
            span.end();
            subscriber.complete();
          },
        });
      });
    });
  }
}
