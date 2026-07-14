export const benchmarkConfig = {
  allTestTypes: ["smoke", "average", "stress", "spike", "breakpoint", "soak"],
  testTypes: ["smoke", "average", "stress", "spike", "breakpoint", "soak"],
  datasetSizes: [50, 100, 500, 1000, 5000, 10000],
  targets: ["monolith", "microservices"],
  reportsDirectory: "reports",
} as const;

export type BenchmarkTestType = (typeof benchmarkConfig.allTestTypes)[number];
export type BenchmarkTarget = (typeof benchmarkConfig.targets)[number];
export type BenchmarkDatasetSize = (typeof benchmarkConfig.datasetSizes)[number];
