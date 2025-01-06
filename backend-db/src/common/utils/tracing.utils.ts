import { trace, context, Context, Span } from '@opentelemetry/api';

export class TracingUtils {
  static tracer = trace.getTracer('backend-db');

  static withSpan<T>(
    name: string,
    ctx: Context,
    attributes: Record<string, any> = {},
    fn: (span: Span) => Promise<T>
  ): Promise<T> {
    const span = this.tracer.startSpan(name, undefined, ctx);
    
    // 设置属性
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        span.setAttribute(key, value);
      }
    });

    return context.with(trace.setSpan(ctx, span), async () => {
      try {
        const result = await fn(span);
        return result;
      } catch (error) {
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
