"use client";

import { useEffect, useState } from "react";
import { Loader2, Play } from "lucide-react";
import { EndpointBreakdownTable } from "@/components/benchmark/endpoint-breakdown-table";
import { MetricComparisonTable } from "@/components/benchmark/metric-comparison-table";
import { RunMetadata } from "@/components/benchmark/run-metadata";
import { TestSummaryTable } from "@/components/benchmark/test-summary-table";
import { benchmarkConfig, type BenchmarkDatasetSize } from "@/config/benchmark";
import type { GenerateBenchmarkResponse } from "@/types/benchmark";
import { BenchmarkComparisonChart } from "@/components/benchmark/benchmark-comparison-chart";

type SavedBenchmarkReport = {
  folderName: string;
  customerLimit: BenchmarkDatasetSize;
  generatedAt: string;
  label: string;
};

type SavedReportsResponse = {
  reports: SavedBenchmarkReport[];
};

export default function BenchmarkPage() {
  const [customerLimit, setCustomerLimit] = useState<BenchmarkDatasetSize>(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  const [isLoadingSelectedReport, setIsLoadingSelectedReport] = useState(false);
  const [report, setReport] = useState<GenerateBenchmarkResponse | null>(null);
  const [savedReports, setSavedReports] = useState<SavedBenchmarkReport[]>([]);
  const [selectedReportFolder, setSelectedReportFolder] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialReport() {
      try {
        const response = await fetch("/api/benchmarks/reports");

        if (!response.ok) {
          throw new Error("Saved benchmark reports could not be loaded");
        }

        const savedReportsResponse =
          (await response.json()) as SavedReportsResponse;
        const latestSavedReport = savedReportsResponse.reports[0];

        setSavedReports(savedReportsResponse.reports);

        if (!latestSavedReport) {
          return;
        }

        const reportResponse = await fetch(
          `/api/benchmarks/reports/${encodeURIComponent(
            latestSavedReport.folderName
          )}`
        );

        if (!reportResponse.ok) {
          throw new Error("Latest benchmark report could not be loaded");
        }

        const latestReport =
          (await reportResponse.json()) as GenerateBenchmarkResponse;

        setReport(latestReport);
        setCustomerLimit(latestReport.customerLimit);
        setSelectedReportFolder(latestSavedReport.folderName);
      } catch (currentError) {
        setError(
          currentError instanceof Error
            ? currentError.message
            : "Latest benchmark report could not be loaded"
        );
      } finally {
        setIsLoadingLatest(false);
      }
    }

    loadInitialReport();
  }, []);

  async function loadSavedReports(): Promise<SavedBenchmarkReport[]> {
    const response = await fetch("/api/benchmarks/reports");

    if (!response.ok) {
      throw new Error("Saved benchmark reports could not be loaded");
    }

    const savedReportsResponse = (await response.json()) as SavedReportsResponse;

    setSavedReports(savedReportsResponse.reports);
    return savedReportsResponse.reports;
  }

  async function loadReportByFolder(folderName: string) {
    setIsLoadingSelectedReport(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/benchmarks/reports/${encodeURIComponent(folderName)}`
      );

      if (!response.ok) {
        throw new Error("Selected benchmark report could not be loaded");
      }

      const selectedReport =
        (await response.json()) as GenerateBenchmarkResponse;

      setReport(selectedReport);
      setCustomerLimit(selectedReport.customerLimit);
      setSelectedReportFolder(folderName);
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : "Selected benchmark report could not be loaded"
      );
    } finally {
      setIsLoadingSelectedReport(false);
    }
  }

  async function generateReport() {
    setIsGenerating(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/benchmarks/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ customerLimit }),
      });

      if (!response.ok) {
        throw new Error("Benchmark report generation failed");
      }

      const generatedReport =
        (await response.json()) as GenerateBenchmarkResponse;
      const refreshedReports = await loadSavedReports();

      setReport(generatedReport);
      setCustomerLimit(generatedReport.customerLimit);
      setSelectedReportFolder(refreshedReports[0]?.folderName ?? "");
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : "Benchmark report generation failed"
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-8 text-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-md border border-zinc-200 bg-white p-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              k6 benchmark suite
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">
              Generate Comparison Report
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
              Dataset size
              <select
                className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm"
                value={customerLimit}
                disabled={
                  isGenerating || isLoadingLatest || isLoadingSelectedReport
                }
                onChange={(event) =>
                  setCustomerLimit(
                    Number(event.target.value) as BenchmarkDatasetSize
                  )
                }
              >
                {benchmarkConfig.datasetSizes.map((size) => (
                  <option key={size} value={size}>
                    {size} customers
                  </option>
                ))}
              </select>
            </label>

            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
              disabled={
                isGenerating || isLoadingLatest || isLoadingSelectedReport
              }
              onClick={generateReport}
            >
              {isGenerating || isLoadingLatest || isLoadingSelectedReport ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isLoadingLatest
                ? "Loading Latest"
                : isLoadingSelectedReport
                  ? "Loading Report"
                  : "Generate Report"}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Saved reports</p>
            <h2 className="mt-1 text-lg font-semibold tracking-normal">
              Load Previous Benchmark Result
            </h2>
          </div>

          <label className="flex w-full flex-col gap-1 text-sm font-medium text-zinc-700 md:max-w-md">
            Report run
            <select
              className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm"
              value={selectedReportFolder}
              disabled={
                isGenerating ||
                isLoadingLatest ||
                isLoadingSelectedReport ||
                savedReports.length === 0
              }
              onChange={(event) => loadReportByFolder(event.target.value)}
            >
              {savedReports.length === 0 ? (
                <option value="">No saved reports</option>
              ) : null}
              {savedReports.map((savedReport, index) => (
                <option
                  key={savedReport.folderName}
                  value={savedReport.folderName}
                >
                  {index === 0 ? "Latest - " : ""}
                  {savedReport.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {isGenerating || isLoadingLatest || isLoadingSelectedReport ? (
          <section className="grid gap-4">
            {benchmarkConfig.testTypes.map((testType) => (
              <div
                key={testType}
                className="h-56 animate-pulse rounded-md border border-zinc-200 bg-white"
              />
            ))}
          </section>
        ) : null}

        {report ? (
          <>
            <RunMetadata report={report} />
            <TestSummaryTable results={report.results} />

            <section className="grid gap-4">
              {report.results.map((result) => (
                <article
                  key={result.testType}
                  className="rounded-md border border-zinc-200 bg-white"
                >
                  <div className="border-b border-zinc-200 px-4 py-3">
                    <h2 className="text-base font-semibold capitalize">
                      {result.testType}
                    </h2>
                  </div>

                  <MetricComparisonTable result={result} />
                  <EndpointBreakdownTable result={result} />
                  <BenchmarkComparisonChart result={result} />
                </article>
              ))}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
