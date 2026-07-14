import { NextResponse } from "next/server";
import { getBenchmarkReportByFolder } from "@/lib/benchmark/latest-report";

type RouteContext = {
  params: Promise<{
    folderName: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { folderName } = await context.params;
  const report = await getBenchmarkReportByFolder(folderName);

  if (!report) {
    return NextResponse.json(
      { message: "Benchmark report not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(report);
}
