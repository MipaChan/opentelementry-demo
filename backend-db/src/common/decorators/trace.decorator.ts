import { TracingUtils } from '../utils/tracing.utils';

export interface TraceOptions {
  attributes?: (args: any[]) => Record<string, any>;
}

export function Trace(options: TraceOptions = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const ctx = args.find((arg) => arg?.context)?.context;
      if (!ctx) {
        return originalMethod.apply(this, args);
      }

      const attributes = options.attributes ? options.attributes(args) : {};
      const name = `${target.constructor.name}.${propertyKey}`;

      return TracingUtils.withSpan(name, ctx, attributes, async () => {
        return originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}
