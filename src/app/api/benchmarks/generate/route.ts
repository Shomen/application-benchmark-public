import { NextResponse } from "next/server";
import {
  benchmarkConfig,
  type BenchmarkDatasetSize,
} from "@/config/benchmark";
import { runK6Benchmark } from "@/lib/benchmark/run-k6";

type GenerateBenchmarkRequest = {
  customerLimit: number;
};

function isValidDatasetSize(value: number): value is BenchmarkDatasetSize {
  return benchmarkConfig.datasetSizes.includes(value as BenchmarkDatasetSize);
}

export async function POST(request: Request) {
  const body = (await request.json()) as GenerateBenchmarkRequest;

  if (!isValidDatasetSize(body.customerLimit)) {
    return NextResponse.json(
      { message: "Invalid customer limit" },
      { status: 400 }
    );
  }

  const generatedAt = new Date().toISOString();
  const runDirectory = generatedAt.replace(/[:.]/g, "-");
  const results = [];

  for (const testType of benchmarkConfig.testTypes) {
    const monolith = await runK6Benchmark({
      testType,
      target: "monolith",
      customerLimit: body.customerLimit,
      runDirectory,
    });

    const microservices = await runK6Benchmark({
      testType,
      target: "microservices",
      customerLimit: body.customerLimit,
      runDirectory,
    });

    results.push({
      testType,
      monolith,
      microservices,
    });
  }

  return NextResponse.json({
    customerLimit: body.customerLimit,
    generatedAt,
    results,
  });
}
