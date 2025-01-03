import { NextResponse } from "next/server";
import { processQuery } from "@/utils/ragUtils";

export async function POST(request) {
  const { message, codebases } = await request.json();
  if (message && codebases && codebases.length > 0) {
    const response = await processQuery(message, codebases);
    return NextResponse.json({ response });
  }
  return NextResponse.json({ message: "Invalid request" }, { status: 400 });
}
