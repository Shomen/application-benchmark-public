import type { BenchmarkRunResult } from "@/types/benchmark";
import {
  higherIsBetter,
  lowerIsBetter,
  type Winner,
} from "@/lib/benchmark/comparison";

type MetricRow = {
  label: string;
  monolith: string | number;
  microservices: string | number;
  winner: Winner;
};

function winnerClassName(winner: Winner): string {
  if (winner === "Tie") {
    return "text-zinc-500";
  }

  return "font-medium text-emerald-700";
}

export function MetricComparisonTable({
  result,
}: {
  result: BenchmarkRunResult;
}) {
  const rows: MetricRow[] = [
    {
      label: "Average response time",
      monolith: `${result.monolith.metrics.averageResponseTime} ms`,
      microservices: `${result.microservices.metrics.averageResponseTime} ms`,
      winner: lowerIsBetter(
        result.monolith.metrics.averageResponseTime,
        result.microservices.metrics.averageResponseTime
      ),
    },
    {
      label: "P95 response time",
      monolith: `${result.monolith.metrics.p95ResponseTime} ms`,
      microservices: `${result.microservices.metrics.p95ResponseTime} ms`,
      winner: lowerIsBetter(
        result.monolith.metrics.p95ResponseTime,
        result.microservices.metrics.p95ResponseTime
      ),
    },
    {
      label: "Requests/sec",
      monolith: result.monolith.metrics.requestsPerSecond,
      microservices: result.microservices.metrics.requestsPerSecond,
      winner: higherIsBetter(
        result.monolith.metrics.requestsPerSecond,
        result.microservices.metrics.requestsPerSecond
      ),
    },
    {
      label: "Failure rate",
      monolith: `${result.monolith.metrics.failureRate}%`,
      microservices: `${result.microservices.metrics.failureRate}%`,
      winner: lowerIsBetter(
        result.monolith.metrics.failureRate,
        result.microservices.metrics.failureRate
      ),
    },
    {
      label: "Total requests",
      monolith: result.monolith.metrics.totalRequests,
      microservices: result.microservices.metrics.totalRequests,
      winner: higherIsBetter(
        result.monolith.metrics.totalRequests,
        result.microservices.metrics.totalRequests
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-100 text-zinc-600">
          <tr>
            <th className="px-4 py-3 font-medium">Metric</th>
            <th className="px-4 py-3 font-medium">Monolith</th>
            <th className="px-4 py-3 font-medium">Microservices</th>
            <th className="px-4 py-3 font-medium">Winner</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="px-4 py-3">{row.label}</td>
              <td className="px-4 py-3">{row.monolith}</td>
              <td className="px-4 py-3">{row.microservices}</td>
              <td className={`px-4 py-3 ${winnerClassName(row.winner)}`}>
                {row.winner}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}