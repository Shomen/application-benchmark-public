import type { BenchmarkRunResult } from "@/types/benchmark";
import { lowerIsBetter } from "@/lib/benchmark/comparison";

type EndpointRow = {
  endpoint: string;
  monolith: number;
  microservices: number;
};

export function EndpointBreakdownTable({
  result,
}: {
  result: BenchmarkRunResult;
}) {
  const rows: EndpointRow[] = [
    {
      endpoint: "GET /api/customers/{id}",
      monolith: result.monolith.metrics.customerDetailsAverage,
      microservices: result.microservices.metrics.customerDetailsAverage,
    },
    {
      endpoint: "GET /api/accounts/{id}",
      monolith: result.monolith.metrics.accountDetailsAverage,
      microservices: result.microservices.metrics.accountDetailsAverage,
    },
  ];

  return (
    <div className="overflow-x-auto border-t border-zinc-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-3 font-medium">Endpoint</th>
            <th className="px-4 py-3 font-medium">Monolith avg</th>
            <th className="px-4 py-3 font-medium">Microservices avg</th>
            <th className="px-4 py-3 font-medium">Winner</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row) => (
            <tr key={row.endpoint}>
              <td className="px-4 py-3">{row.endpoint}</td>
              <td className="px-4 py-3">{row.monolith} ms</td>
              <td className="px-4 py-3">{row.microservices} ms</td>
              <td className="px-4 py-3 font-medium text-emerald-700">
                {lowerIsBetter(row.monolith, row.microservices)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}