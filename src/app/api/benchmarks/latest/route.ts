import { NextResponse } from "next/server";
import { getLatestBenchmarkReport } from "@/lib/benchmark/latest-report";

export async function GET() {
  const report = await getLatestBenchmarkReport();

  if (!report) {
    return NextResponse.json(
      { message: "No benchmark reports found" },
      { status: 404 }
    );
  }

  return NextResponse.json(report);
}
