import { NextResponse } from "next/server";
import { fetchRepoContents } from "@/utils/ragUtils";

// Codebase database.
export let codebases = [];

function extractCodebaseName(url) {
  const parts = url.split("/");
  return parts[parts.length - 1].replace(".git", "");
}

export async function GET() {
  return NextResponse.json(codebases);
}

export async function POST(request) {
  try {
    const { url } = await request.json();

    console.log(`[${new Date().toISOString()}] Received codebase URL: ${url}`);

    if (!url) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }

    // Fetch repository contents
    console.time(`Fetching contents for ${url}`);
    const repoContents = await fetchRepoContents(url);
    console.timeEnd(`Fetching contents for ${url}`);

    // Extract codebase name
    const name = extractCodebaseName(url);

    // Add codebase with its contents
    codebases.push({
      url,
      name,
      contents: repoContents,
      addedAt: new Date().toISOString(),
    });

    console.log(`[${new Date().toISOString()}] Codebase added:`, {
      name,
      contentsLength: repoContents ? repoContents.length : 0,
    });

    console.log(
      "Current codebases:",
      codebases.map((c) => c.name)
    );

    return NextResponse.json(
      {
        message: "Codebase added successfully",
        contents: repoContents,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding codebase:", error);
    return NextResponse.json(
      { message: "Failed to add codebase", error: error.message },
      { status: 500 }
    );
  }
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
