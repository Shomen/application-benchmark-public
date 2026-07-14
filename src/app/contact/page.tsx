import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-zinc-950">
      <section className="mx-auto flex max-w-4xl flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-zinc-500">Contact</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            Project Contact
          </h1>
        </div>

        <div className="rounded-md border border-zinc-200 bg-white p-6">
          <p className="max-w-2xl text-base leading-7 text-zinc-600">
            For questions about this benchmark application, the Symfony
            monolith, microservices setup, or k6 report generation, please use
            the contact email below.
          </p>

          <a
            href="mailto:shomenmuhury@yahoo.com"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            <Mail className="h-4 w-4" />
            shomenmuhury@yahoo.com
          </a>
        </div>
      </section>
    </main>
  );
}