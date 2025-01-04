"use client";

import { useState, useEffect } from "react";
import CodebaseManager from "@/components/CodebaseManager";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [codebases, setCodebases] = useState([]);
  const [selectedCodebases, setSelectedCodebases] = useState([]);

  useEffect(() => {
    fetchCodebases();
  }, []);

  const fetchCodebases = async () => {
    const response = await fetch("/api/codebases");
    const data = await response.json();

    console.log("Fetched codebases:", data);

    setCodebases(data);
  };

  return (
    <main className="min-h-screen h-full flex flex-col justify-center bg-gradient-to-br from-black via-blue-900 to-green-900 p-8">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">
          G I T / C H A T
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <CodebaseManager
            codebases={codebases}
            selectedCodebases={selectedCodebases}
            onCodebasesChange={fetchCodebases}
            onSelectedCodebasesChange={setSelectedCodebases}
          />
          <ChatInterface selectedCodebases={selectedCodebases} />
        </div>
      </div>
    </main>
  );
}
