import type { GenerateBenchmarkResponse } from "@/types/benchmark";

export function RunMetadata({
  report,
}: {
  report: GenerateBenchmarkResponse;
}) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-5">
      <h2 className="text-base font-semibold">Run Metadata</h2>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-zinc-500">Generated at</p>
          <p className="mt-1 font-medium text-zinc-950">
            {new Date(report.generatedAt).toLocaleString()}
          </p>
        </div>

        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-zinc-500">Customer dataset</p>
          <p className="mt-1 font-medium text-zinc-950">
            {report.customerLimit} customers
          </p>
        </div>

        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-zinc-500">Account dataset</p>
          <p className="mt-1 font-medium text-zinc-950">
            {report.customerLimit * 10} accounts
          </p>
        </div>

        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-zinc-500">Test categories</p>
          <p className="mt-1 font-medium text-zinc-950">
            {report.results.length}
          </p>
        </div>
      </div>
    </section>
  );
}