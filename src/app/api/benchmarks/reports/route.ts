import { NextResponse } from "next/server";
import { getSavedBenchmarkReports } from "@/lib/benchmark/latest-report";

export async function GET() {
  return NextResponse.json({
    reports: await getSavedBenchmarkReports(),
  });
}
