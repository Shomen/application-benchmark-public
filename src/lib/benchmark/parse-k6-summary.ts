type K6Metric = {
  count?: number;
  rate?: number;
  value?: number;
  avg?: number;
  min?: number;
  med?: number;
  max?: number;
  p90?: number;
  p95?: number;
  "p(90)"?: number;
  "p(95)"?: number;
};

type K6Summary = {
  metrics: Record<string, K6Metric>;
};

export type BenchmarkMetrics = {
  averageResponseTime: number;
  p95ResponseTime: number;
  requestsPerSecond: number;
  failureRate: number;
  totalRequests: number;
  checksRate: number;
  customerDetailsAverage: number;
  accountDetailsAverage: number;
};

function round(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}

function getMetric(summary: K6Summary, name: string): K6Metric {
  return summary.metrics[name] ?? {};
}

function getP95(metric: K6Metric): number {
  return metric["p(95)"] ?? metric.p95 ?? 0;
}

function getRate(metric: K6Metric): number {
  return metric.rate ?? metric.value ?? 0;
}

export function parseK6Summary(summary: K6Summary): BenchmarkMetrics {
  const duration = getMetric(summary, "http_req_duration");
  const requests = getMetric(summary, "http_reqs");
  const failed = getMetric(summary, "http_req_failed");
  const checks = getMetric(summary, "checks");
  const customerDetails = getMetric(summary, "endpoint_customer_details_duration");
  const accountDetails = getMetric(summary, "endpoint_account_details_duration");

  return {
    averageResponseTime: round(duration.avg ?? 0),
    p95ResponseTime: round(getP95(duration)),
    requestsPerSecond: round(requests.rate ?? 0),
    failureRate: round(getRate(failed) * 100),
    totalRequests: requests.count ?? 0,
    checksRate: round(getRate(checks) * 100),
    customerDetailsAverage: round(customerDetails.avg ?? 0),
    accountDetailsAverage: round(accountDetails.avg ?? 0),
  };
}
