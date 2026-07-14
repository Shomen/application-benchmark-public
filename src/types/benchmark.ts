import type {
  BenchmarkDatasetSize,
  BenchmarkTestType,
} from "@/config/benchmark";
import type { BenchmarkMetrics } from "@/lib/benchmark/parse-k6-summary";

export type BenchmarkRunResult = {
  testType: BenchmarkTestType;
  monolith: {
    metrics: BenchmarkMetrics;
  };
  microservices: {
    metrics: BenchmarkMetrics;
  };
};

export type GenerateBenchmarkResponse = {
  customerLimit: BenchmarkDatasetSize;
  generatedAt: string;
  results: BenchmarkRunResult[];
};