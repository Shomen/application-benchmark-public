import { spawn } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  benchmarkConfig,
  type BenchmarkTarget,
  type BenchmarkTestType,
} from "@/config/benchmark";
import { parseK6Summary, type BenchmarkMetrics } from "./parse-k6-summary";

type RunK6Input = {
  testType: BenchmarkTestType;
  target: BenchmarkTarget;
  customerLimit: number;
  runDirectory: string;
};

export type RunK6Result = {
  testType: BenchmarkTestType;
  target: BenchmarkTarget;
  customerLimit: number;
  reportPath: string;
  metrics: BenchmarkMetrics;
};

function requireRuntimeEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value.replace(/\/+$/, "");
}

function runCommand(
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv
): Promise<void> {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, {
      cwd: process.cwd(),
      env,
      shell: process.platform === "win32",
      stdio: "inherit",
    });

    childProcess.on("error", reject);

    childProcess.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

export async function runK6Benchmark(input: RunK6Input): Promise<RunK6Result> {
  const reportFileName = `${input.testType}-${input.target}-${input.customerLimit}.json`;
  const reportsDirectory = path.join(
    process.cwd(),
    benchmarkConfig.reportsDirectory,
    input.runDirectory
  );
  const reportPath = path.join(reportsDirectory, reportFileName);

  await mkdir(reportsDirectory, { recursive: true });

  await runCommand(
    "k6",
    ["run", "--summary-export", reportPath, "k6/scripts/benchmark.js"],
    {
      ...process.env,
      TEST_TYPE: input.testType,
      TARGET: input.target,
      CUSTOMER_LIMIT: String(input.customerLimit),
      MONOLITH_URL: requireRuntimeEnv("MONOLITH_BASE_URL"),
      CUSTOMER_SERVICE_URL: requireRuntimeEnv("CUSTOMER_SERVICE_URL"),
      ACCOUNT_SERVICE_URL: requireRuntimeEnv("ACCOUNT_SERVICE_URL"),
    }
  );

  const summary = JSON.parse(await readFile(reportPath, "utf8"));

  return {
    ...input,
    reportPath,
    metrics: parseK6Summary(summary),
  };
}
