import { NextResponse } from "next/server";

// This is a mock database. In a real application, you would use a proper database.
let codebases = [];

function extractCodebaseName(url) {
  const parts = url.split("/");
  return parts[parts.length - 1].replace(".git", "");
}

export async function GET() {
  return NextResponse.json(codebases);
}

export async function POST(request) {
  const { url } = await request.json();
  if (url && !codebases.some((codebase) => codebase.url === url)) {
    const name = extractCodebaseName(url);
    codebases.push({ url, name });
    return NextResponse.json(
      { message: "Codebase added successfully" },
      { status: 201 }
    );
  }
  return NextResponse.json({ message: "Invalid request" }, { status: 400 });
}

export async function DELETE(request) {
  const { url } = await request.json();
  const index = codebases.findIndex((codebase) => codebase.url === url);
  if (index > -1) {
    codebases.splice(index, 1);
    return NextResponse.json({ message: "Codebase removed successfully" });
  }
  return NextResponse.json({ message: "Codebase not found" }, { status: 404 });
}
