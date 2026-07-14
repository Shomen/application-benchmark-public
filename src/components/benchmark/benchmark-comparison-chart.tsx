"use client";

import { useMemo } from "react";
import { scaleBand, scaleLinear, max } from "d3";
import type { BenchmarkRunResult } from "@/types/benchmark";

type ChartRow = {
  label: string;
  monolith: number;
  microservices: number;
  unit: string;
};

export function BenchmarkComparisonChart({
  result,
}: {
  result: BenchmarkRunResult;
}) {
  const rows: ChartRow[] = useMemo(
    () => [
      {
        label: "Avg response",
        monolith: result.monolith.metrics.averageResponseTime,
        microservices: result.microservices.metrics.averageResponseTime,
        unit: "ms",
      },
      {
        label: "P95 response",
        monolith: result.monolith.metrics.p95ResponseTime,
        microservices: result.microservices.metrics.p95ResponseTime,
        unit: "ms",
      },
      {
        label: "Requests/sec",
        monolith: result.monolith.metrics.requestsPerSecond,
        microservices: result.microservices.metrics.requestsPerSecond,
        unit: "req/s",
      },
      {
        label: "Failure rate",
        monolith: result.monolith.metrics.failureRate,
        microservices: result.microservices.metrics.failureRate,
        unit: "%",
      },
      {
        label: "Customer endpoint",
        monolith: result.monolith.metrics.customerDetailsAverage,
        microservices: result.microservices.metrics.customerDetailsAverage,
        unit: "ms",
      },
      {
        label: "Account endpoint",
        monolith: result.monolith.metrics.accountDetailsAverage,
        microservices: result.microservices.metrics.accountDetailsAverage,
        unit: "ms",
      },
    ],
    [result]
  );

  const width = 920;
  const rowHeight = 56;
  const margin = { top: 24, right: 120, bottom: 24, left: 150 };
  const height = margin.top + margin.bottom + rows.length * rowHeight;

  const highestValue = max(rows, (row) =>
    Math.max(row.monolith, row.microservices)
  );

  const xScale = scaleLinear()
    .domain([0, highestValue ? highestValue * 1.12 : 1])
    .range([margin.left, width - margin.right]);

  const yScale = scaleBand<string>()
    .domain(rows.map((row) => row.label))
    .range([margin.top, height - margin.bottom])
    .paddingInner(0.28)
    .paddingOuter(0.2);

  const barHeight = Math.max((yScale.bandwidth() - 8) / 2, 8);

  return (
    <div className="border-t border-zinc-200 px-4 py-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">
          Visual Comparison
        </h3>

        <div className="flex gap-4 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-700" />
            Monolith
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-sky-600" />
            Microservices
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          className="min-w-[760px]"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${result.testType} benchmark visual comparison`}
        >
          {rows.map((row) => {
            const y = yScale(row.label) ?? 0;
            const monolithWidth = xScale(row.monolith) - margin.left;
            const microservicesWidth = xScale(row.microservices) - margin.left;

            return (
              <g key={row.label}>
                <text
                  x={margin.left - 14}
                  y={y + yScale.bandwidth() / 2 + 4}
                  textAnchor="end"
                  className="fill-zinc-700 text-[13px]"
                >
                  {row.label}
                </text>

                <rect
                  x={margin.left}
                  y={y}
                  width={Math.max(monolithWidth, 0)}
                  height={barHeight}
                  rx={3}
                  className="fill-emerald-700"
                />
                <rect
                  x={margin.left}
                  y={y + barHeight + 8}
                  width={Math.max(microservicesWidth, 0)}
                  height={barHeight}
                  rx={3}
                  className="fill-sky-600"
                />

                <text
                  x={xScale(row.monolith) + 8}
                  y={y + barHeight - 2}
                  className="fill-zinc-700 text-[12px]"
                >
                  {row.monolith} {row.unit}
                </text>
                <text
                  x={xScale(row.microservices) + 8}
                  y={y + barHeight * 2 + 6}
                  className="fill-zinc-700 text-[12px]"
                >
                  {row.microservices} {row.unit}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}