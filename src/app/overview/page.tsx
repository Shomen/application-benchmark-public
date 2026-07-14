const technologies = [
  {
    title: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "lucide-react"],
  },
  {
    title: "Benchmarking",
    items: ["k6", "JSON summary reports", "Custom endpoint metrics"],
  },
  {
    title: "Backend Systems",
    items: ["Symfony monolith", "Symfony customer microservice", "Symfony account microservice"],
  },
  {
    title: "Database and Runtime",
    items: ["PostgreSQL", "Node.js", "Docker"],
  },
];

const apiGroups = [
  "Customer CRUD APIs",
  "Account CRUD APIs",
  "Monolith customer accounts endpoint",
  "Read-focused benchmark endpoints with sampled customer and account IDs",
];

export default function OverviewPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="max-w-3xl">
          <p className="text-sm font-medium text-zinc-500">Project stack</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            Project Overview
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            This benchmark application compares a Symfony monolith with a
            microservices setup using k6 load testing and a Next.js reporting
            interface.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {technologies.map((group) => (
            <article
              key={group.title}
              className="rounded-md border border-zinc-200 bg-white p-5"
            >
              <h2 className="text-base font-semibold">{group.title}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-md border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold">API Coverage</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {apiGroups.map((item) => (
              <div
                key={item}
                className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}