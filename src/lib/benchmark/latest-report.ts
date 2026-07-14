import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  benchmarkConfig,
  type BenchmarkDatasetSize,
  type BenchmarkTarget,
  type BenchmarkTestType,
} from "@/config/benchmark";
import { parseK6Summary } from "./parse-k6-summary";
import type { GenerateBenchmarkResponse } from "@/types/benchmark";

type ReportFile = {
  fileName: string;
  testType: BenchmarkTestType;
  target: BenchmarkTarget;
  customerLimit: BenchmarkDatasetSize;
};

export type SavedBenchmarkReport = {
  folderName: string;
  customerLimit: BenchmarkDatasetSize;
  generatedAt: string;
  label: string;
};

const reportFilePatterns = [
  /^(smoke|average|stress|spike|breakpoint|soak)-(monolith|microservices)-(\d+)\.json$/,
  /^(smoke|average|stress|spike|breakpoint|soak)-(monolith|microservices)-(\d+)-.+\.json$/,
];
const runFolderPattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z$/;

function restoreIsoTimestamp(folderName: string): string {
  const match = folderName.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/
  );

  if (!match) {
    return folderName;
  }

  return `${match[1]}T${match[2]}:${match[3]}:${match[4]}.${match[5]}Z`;
}

function formatReportLabel(
  customerLimit: BenchmarkDatasetSize,
  generatedAt: string
): string {
  return `${customerLimit} customers - ${new Date(generatedAt).toLocaleString()}`;
}

function parseReportFileName(fileName: string): ReportFile | null {
  const match = reportFilePatterns
    .map((pattern) => fileName.match(pattern))
    .find((currentMatch) => currentMatch);

  if (!match) {
    return null;
  }

  const customerLimit = Number(match[3]);

  if (
    !benchmarkConfig.datasetSizes.includes(customerLimit as BenchmarkDatasetSize)
  ) {
    return null;
  }

  return {
    fileName,
    testType: match[1] as BenchmarkTestType,
    target: match[2] as BenchmarkTarget,
    customerLimit: customerLimit as BenchmarkDatasetSize,
  };
}

function hasCompleteReportSet(
  reportFiles: ReportFile[],
  customerLimit: BenchmarkDatasetSize
): boolean {
  return benchmarkConfig.allTestTypes.some((testType) =>
    hasCompleteTestType(reportFiles, customerLimit, testType)
  );
}

function hasCompleteTestType(
  reportFiles: ReportFile[],
  customerLimit: BenchmarkDatasetSize,
  testType: BenchmarkTestType
): boolean {
  return benchmarkConfig.targets.every((target) =>
      reportFiles.some(
        (file) =>
          file.customerLimit === customerLimit &&
          file.testType === testType &&
          file.target === target
      )
  );
}

function isValidRunFolderName(folderName: string): boolean {
  return runFolderPattern.test(folderName);
}

async function getReportsDirectory(): Promise<string> {
  return path.join(process.cwd(), benchmarkConfig.reportsDirectory);
}

async function getRunFolderNames(reportsDirectory: string): Promise<string[]> {
  const directoryEntries = await readdir(reportsDirectory, {
    withFileTypes: true,
  });

  return directoryEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter(isValidRunFolderName)
    .sort()
    .reverse();
}

async function getReportFiles(runPath: string): Promise<ReportFile[]> {
  const directoryEntries = await readdir(runPath, { withFileTypes: true });

  return directoryEntries
    .filter((entry) => entry.isFile())
    .map((entry) => parseReportFileName(entry.name))
    .filter((file): file is ReportFile => Boolean(file));
}

function getCompleteCustomerLimit(
  reportFiles: ReportFile[]
): BenchmarkDatasetSize | null {
  return (
    benchmarkConfig.datasetSizes.find((datasetSize) =>
      hasCompleteReportSet(reportFiles, datasetSize)
    ) ?? null
  );
}

async function parseReport(runPath: string, reportFile: ReportFile) {
  const reportPath = path.join(runPath, reportFile.fileName);
  const summary = JSON.parse(await readFile(reportPath, "utf8"));

  return {
    testType: reportFile.testType,
    target: reportFile.target,
    customerLimit: reportFile.customerLimit,
    reportPath,
    metrics: parseK6Summary(summary),
  };
}

async function getRunSummary(
  reportsDirectory: string,
  folderName: string
): Promise<SavedBenchmarkReport | null> {
  const runPath = path.join(reportsDirectory, folderName);
  const reportFiles = await getReportFiles(runPath);
  const customerLimit = getCompleteCustomerLimit(reportFiles);

  if (!customerLimit) {
    return null;
  }

  const generatedAt = restoreIsoTimestamp(folderName);

  return {
    folderName,
    customerLimit,
    generatedAt,
    label: formatReportLabel(customerLimit, generatedAt),
  };
}

export async function getSavedBenchmarkReports(): Promise<
  SavedBenchmarkReport[]
> {
  const reportsDirectory = await getReportsDirectory();
  const runFolders = await getRunFolderNames(reportsDirectory);
  const reports = await Promise.all(
    runFolders.map((folderName) => getRunSummary(reportsDirectory, folderName))
  );

  return reports.filter(
    (report): report is SavedBenchmarkReport => Boolean(report)
  );
}

export async function getBenchmarkReportByFolder(
  folderName: string
): Promise<GenerateBenchmarkResponse | null> {
  if (!isValidRunFolderName(folderName)) {
    return null;
  }

  const reportsDirectory = await getReportsDirectory();
  const runPath = path.join(reportsDirectory, folderName);
  const reportFiles = await getReportFiles(runPath);
  const customerLimit = getCompleteCustomerLimit(reportFiles);

  if (!customerLimit) {
    return null;
  }

  const results = [];

  for (const testType of benchmarkConfig.allTestTypes) {
    if (!hasCompleteTestType(reportFiles, customerLimit, testType)) {
      continue;
    }

    const monolithFile = reportFiles.find(
      (file) =>
        file.customerLimit === customerLimit &&
        file.testType === testType &&
        file.target === "monolith"
    );
    const microservicesFile = reportFiles.find(
      (file) =>
        file.customerLimit === customerLimit &&
        file.testType === testType &&
        file.target === "microservices"
    );

    if (!monolithFile || !microservicesFile) {
      return null;
    }

    const monolith = await parseReport(runPath, monolithFile);
    const microservices = await parseReport(runPath, microservicesFile);

    results.push({
      testType,
      monolith,
      microservices,
    });
  }

  return {
    customerLimit,
    generatedAt: restoreIsoTimestamp(folderName),
    results,
  };
}

export async function getLatestBenchmarkReport(): Promise<GenerateBenchmarkResponse | null> {
  const savedReports = await getSavedBenchmarkReports();
  const latestReport = savedReports[0];

  if (!latestReport) {
    return null;
  }

  return getBenchmarkReportByFolder(latestReport.folderName);
}
