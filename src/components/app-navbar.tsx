import Link from "next/link";
import { Activity } from "lucide-react";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/benchmark", label: "Benchmark" },
  { href: "/overview", label: "Overview" },
  { href: "/contact", label: "Contact" },
];

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-white">
            <Activity className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold text-zinc-950">
            Application Benchmark
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}