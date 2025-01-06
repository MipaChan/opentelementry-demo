# OpenTelemetry 集成指南

## 项目概述
本项目演示了如何在应用程序中集成 OpenTelemetry 进行分布式追踪和监控。通过这个demo，您可以学习如何：
- 配置 OpenTelemetry
- 创建和管理追踪（Traces）
- 收集和导出遥测数据
- 与其他监控系统集成

## 前置要求
- Node.js >= 14
- npm 或 yarn
- 基本了解分布式系统和监控概念

## 安装依赖
```bash
npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
```

## 基础配置
### 1. 初始化 Tracer Provider
```typescript
import { NodeTracerProvider } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'your-service-name',
  }),
});
provider.register();
```

### 2. 配置导出器
```typescript
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
```

## 使用指南

### 创建 Spans
```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('your-service-name');

// 创建一个新的 span
const span = tracer.startSpan('operation-name');
try {
  // 执行业务逻辑
  span.setAttributes({
    'custom.attribute': 'value'
  });
} catch (error) {
  span.recordException(error);
} finally {
  span.end();
}
```

### 上下文传播
```typescript
import { context, trace } from '@opentelemetry/api';

const span = tracer.startSpan('parent-operation');
context.with(trace.setSpan(context.active(), span), () => {
  // 在这个上下文中创建的所有spans都将成为当前span的子span
});
```

## 最佳实践
1. 始终使用有意义的span名称
2. 适当设置span属性以提供更多上下文
3. 正确处理错误和异常
4. 合理使用采样策略
5. 注意性能影响

## 故障排除
### 常见问题
1. 追踪数据未显示
   - 检查导出器配置
   - 确认接收端点是否正确
   - 验证网络连接

2. 性能问题
   - 调整采样率
   - 检查span处理器配置
   - 优化span创建逻辑

### 调试技巧
- 启用调试日志
- 使用测试导出器
- 监控span处理器状态

## 参考资源
- [OpenTelemetry 官方文档](https://opentelemetry.io/docs/)
- [Node.js SDK 文档](https://github.com/open-telemetry/opentelemetry-js)
- [最佳实践指南](https://opentelemetry.io/docs/concepts/semantic-conventions/)
