import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <p className="text-sm font-medium text-zinc-500">
          Monolith vs Microservices
        </p>

        <h1 className="text-4xl font-semibold tracking-normal">
          Application Benchmark
        </h1>

        <p className="max-w-2xl text-base leading-7 text-zinc-600">
          This application benchmarks a Symfony monolith against Symfony
          microservices using k6 load testing. It generates JSON reports and
          presents response time, throughput, failure rate, and endpoint-level
          comparison tables.
        </p>

        <div>
          <Link
            href="/benchmark"
            className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white"
          >
            Open Benchmark
          </Link>
        </div>
      </section>
    </main>
  );
}