import { NextResponse } from "next/server";
import Groq from "groq-sdk";
// Import the codebases from the route that stores them
import { codebases } from "@/app/api/codebases/route";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { message, codebases: selectedCodebases } = await request.json();

    console.log(`[${new Date().toISOString()}] Received chat request`);
    console.log(
      "Current global codebases:",
      codebases.map((c) => ({
        name: c.name,
        addedAt: c.addedAt,
        contentsLength: c.contents ? c.contents.length : 0,
      }))
    );
    console.log("Selected codebases:", selectedCodebases);

    if (!message || !selectedCodebases || selectedCodebases.length === 0) {
      console.log("Invalid request: missing message or codebases");
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // Retrieve contents of selected codebases
    const codebaseContexts = selectedCodebases
      .map((name) => {
        const codebase = codebases.find((c) => c.name === name);
        console.log(
          `Finding codebase for name '${name}':`,
          codebase ? "Found" : "Not Found"
        );
        return codebase ? codebase.contents : [];
      })
      .flat();

    console.log("Codebase contexts found:", codebaseContexts.length);

    console.log("Codebase contexts:", codebaseContexts);

    // Prepare context-rich prompt
    const contextualPrompt = preparePrompt(message, codebaseContexts);

    // Generate response using Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
            You are a helpful AI assistant specialized in code analysis. 
            Provide precise and context-aware answers.
          `,
        },
        {
          role: "user",
          content: contextualPrompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      max_tokens: 8000,
    });

    // Extract response
    const response =
      chatCompletion.choices[0]?.message?.content ||
      "I couldn't generate a response.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to prepare a context-rich prompt
function preparePrompt(query, codebaseContents) {
  // Limit the context to prevent overwhelming the LLM
  const MAX_CONTEXT_LENGTH = 10000;

  // Prepare context from codebase contents
  const context = codebaseContents
    .map((file) => `File: ${file.path}\nContent:\n${file.content}`)
    .join("\n\n")
    .slice(0, MAX_CONTEXT_LENGTH);

  return `
    Context from selected codebases:
    ${context}

    Question: ${query}

    Please provide a detailed and accurate answer based on the context above. 
    If the context does not contain relevant information, state that clearly.
  `;
}

// Function to process a user's query
export async function processQuery(query, codebaseNames) {
  return `This is a placeholder response for the query "${query}" in codebases: 
    ${codebaseNames.join(", ")}.`;
}
