import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

/**
 * 產生 OpenTelemetry SDK 實例
 */
function generateTracer() {
  const mongoInstrumentation = new MongoDBInstrumentation({
    enhancedDatabaseReporting: true,
  });

  const nestInstrumentation = new NestInstrumentation({
    enabled: true,
  });

  const traceExporter = new OTLPTraceExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
  });

  return new NodeSDK({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'backend-db',
      'service.namespace': 'microservice',
    }),
    traceExporter: traceExporter,
    instrumentations: [
      mongoInstrumentation,
      nestInstrumentation,
    ],
  });
}

/**
 * 啟動 SDK 
 */
function bootstrapTracer(sdk: NodeSDK) {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.NONE);
  sdk.start();
}

/**
 * 主程序
 */
function main() {
  const sdk = generateTracer();
  bootstrapTracer(sdk);

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('SDK shutdown successfully.'))
      .catch((error) => console.log('Error shutdown SDK.', error))
      .finally(() => process.exit(0));
  });
}

main();