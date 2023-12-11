# problem
各个监控厂商在获取请求的 ResourceTiming 都有不同的实现：
* datadog：在请求结束时，立即通过 performance.getEntriesByName 获取，源码地址：https://github.com/DataDog/browser-sdk/blob/29747b6438328d1cf5cd0c95f35c1fc2a527f5c6/packages/rum-core/src/domain/resource/resourceCollection.ts#L42
* sentry：先注册 PerformanceObserver 的监听器，在请求结束时，订阅该监听器，1000 毫秒后移除订阅，源码地址：https://github.com/getsentry/sentry-javascript/blob/a063fbccd79cab77da627e45166e50ddcd96928c/packages/tracing-internal/src/browser/request.ts#L148C2-L148C2
* openTelemetry-js：在请求结束的 300 毫秒后，通过 performance.getEntriesByType 获取 'resource' 的数据，然后再经过指定规则过滤出目标数据，源码地址：https://github.com/open-telemetry/opentelemetry-js/blob/5b0fb7b40dd6809dc9c362378b90e0ee8fa45f62/experimental/packages/opentelemetry-instrumentation-fetch/src/fetch.ts#L235C4-L235C4
* 