import type { BenchmarkRunResult } from "@/types/benchmark";
import { lowerIsBetter } from "@/lib/benchmark/comparison";

export function TestSummaryTable({
  results,
}: {
  results: BenchmarkRunResult[];
}) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-4 py-3">
        <h2 className="text-base font-semibold">Test Summary</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 text-zinc-600">
            <tr>
              <th className="px-4 py-3 font-medium">Test type</th>
              <th className="px-4 py-3 font-medium">Monolith avg</th>
              <th className="px-4 py-3 font-medium">Microservices avg</th>
              <th className="px-4 py-3 font-medium">Winner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {results.map((result) => {
              const winner = lowerIsBetter(
                result.monolith.metrics.averageResponseTime,
                result.microservices.metrics.averageResponseTime
              );

              return (
                <tr key={result.testType}>
                  <td className="px-4 py-3 capitalize">{result.testType}</td>
                  <td className="px-4 py-3">
                    {result.monolith.metrics.averageResponseTime} ms
                  </td>
                  <td className="px-4 py-3">
                    {result.microservices.metrics.averageResponseTime} ms
                  </td>
                  <td className="px-4 py-3 font-medium text-emerald-700">
                    {winner}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}