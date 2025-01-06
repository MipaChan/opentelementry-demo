import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

/**
 * 產生 OpenTelemetry SDK 實例
 */
function generateTracer() {
    const traceExporter = new OTLPTraceExporter({
        url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,  // OpenTelemetry Collector OTLP gRPC Receiver 的 Endpoint
    });

    return new NodeSDK({
        // 建立 Resource Attribute，運用 Semantic Conventions 提供的常數當作 Attribute Name
        resource: new Resource({
            [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'backend-api',
        }),
        // 設定 Trace 功能的 Exporter
        traceExporter: traceExporter,
        // 設定 NestJS Instrumentation 來產生 NestJS 相關資訊，同時設定 Http Instrumentation 自動為 HTTP 操作建立相關資訊以及實現 Context Propagation
        instrumentations: [
            new NestInstrumentation(),
            new HttpInstrumentation(),
        ],
    });
}

/**
 * 啟動 SDK 
 */
function bootstrapTracer(sdk: NodeSDK) {
    // 註冊 Logger，並指定輸出 Debug 以上的 Log
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.NONE);
    sdk.start();
}

/**
 * 主程序
 */
function main() {
    const sdk = generateTracer();
    bootstrapTracer(sdk);

    // 在程式關閉之前 Graceful Shutdown SDK
    process.on('SIGTERM', () => {
        sdk
            .shutdown()
            .then(() => console.log('SDK shutdown successfully.'))
            .catch((error) => console.log('Error shutdown SDK.', error))
            .finally(() => process.exit(0));
    });
}

main();