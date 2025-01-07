# Quick Start
```bash
> git clone https://github.com/MipaChan/opentelementry-demo.git
> docker compose -f docker-compose.dev.yml up -d --build
```

- Frontend,http://host/ 
- Backend,http://host/api
- Grafana-UI,http://host/grafana


# 架构
## 基本介绍
一个典型的链路追踪系统通常包含以下几个主要模块：

1. 数据采集模块（Collector）
   - 负责从应用程序中收集追踪数据
   - 包括spans、traces、metrics等信息
   - 通常通过SDK或agent方式实现

2. 数据处理模块（Processor）
   - 对收集到的原始数据进行处理和转换
   - 数据清洗、过滤、格式化
   - 建立spans之间的父子关系

3. 存储模块（Storage）
   - 将处理后的追踪数据持久化
   - 常用存储包括Elasticsearch、Cassandra等
   - 需要考虑数据的查询效率和存储成本

4. 查询服务模块（Query Service）
   - 提供数据查询接口
   - 支持多维度检索和过滤
   - 实现分布式追踪数据的聚合分析

5. 可视化模块（UI）
   - 展示分布式调用链路图
   - 提供性能分析视图
   - 告警和异常展示

6. 告警模块（Alert）
   - 监控异常情况
   - 设置告警规则
   - 发送告警通知


## 各部分选型

- Opentelemetry
   - 开源标准化：OpenTelemetry 是 CNCF 的孵化项目，提供统一的可观测性标准
   - 多语言支持：支持多种编程语言的SDK
   - 供应商中立：不绑定特定厂商，可以灵活切换后端存储和展示方案
   - 生态系统完善
   
- Grafana
   - 开源：Grafana 是一个开源的数据可视化工具
   - 多数据源：支持多种数据源，包括Prometheus、Elasticsearch、Loki等
   - 插件丰富：提供丰富的插件，支持自定义数据源和图表
   - 生态系统完善
   - 后续可以继续集成Loki之类的组件，用于日志查询、报警等

- Grafana Tempo 
   - 开源：由Grafana Labs开源的分布式追踪系统，很方便和Grafana集成
   - 低成本：基于对象存储，存储成本低，适合长期存储
   - 高可用：支持水平扩展，高可用部署
   - 支持TraceQL查询语言,很方便后续的操作


## 数据流通

1. 应用程序采集
   - 应用通过OpenTelemetry SDK采集traces、metrics等数据
   - 前后端应用分别采集自身的telemetry数据
   - 采集的数据包含完整的调用链路信息

2. 数据上报
   - 数据通过OTLP协议上报到OpenTelemetry Collector
   - Collector负责接收、处理和转发数据
   - 支持批量上报和数据缓冲

3. 数据存储
   - Traces数据存储在Tempo
   - Metrics数据存储在Prometheus
   - 实现数据的持久化和查询

4. 数据展示
   - Grafana作为统一的展示平台
   - 支持多种数据源的整合展示
   - 提供丰富的可视化组件

## 部署说明

### 配置说明
配置文件位于 `config` 目录下:
- `otel-collector-config.yaml`: OpenTelemetry Collector配置
- `tempo.yaml`: Tempo配置
- `grafana/`: Grafana配置目录


[next.js接入指南](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry#manual-opentelemetry-configuration)




## 参考资源

- [OpenTelemetry文档](https://opentelemetry.io/docs/)
- [Grafana文档](https://grafana.com/docs/)
- [Tempo文档](https://grafana.com/docs/tempo/latest/)