"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

export default function CodebaseManager({
  codebases,
  selectedCodebases,
  onCodebasesChange,
  onSelectedCodebasesChange,
}) {
  const [newCodebase, setNewCodebase] = useState("");

  const handleAddCodebase = async () => {
    if (newCodebase) {
      const response = await fetch("/api/codebases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newCodebase }),
      });
      if (response.ok) {
        setNewCodebase("");
        onCodebasesChange();
      }
    }
  };

  const handleRemoveCodebase = async (url) => {
    const response = await fetch("/api/codebases", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (response.ok) {
      onCodebasesChange();
    }
  };

  return (
    <Card className="w-full lg:w-1/3 bg-white/10 backdrop-blur-lg border-none text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Manage Codebases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input
            type="text"
            value={newCodebase}
            onChange={(e) => setNewCodebase(e.target.value)}
            placeholder="Enter codebase URL"
            className="mr-2 bg-white/80 border-none text-black placeholder-white/60 caret-blue-500"
          />
          <Button
            onClick={handleAddCodebase}
            variant="secondary"
            className="bg-cyan-800 hover:bg-cyan-900 text-white"
          >
            Add
          </Button>
        </div>
        <ul className="space-y-2">
          {codebases.map((codebase, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 rounded bg-black/30"
            >
              <div className="flex items-center">
                <Checkbox
                  id={`codebase-${index}`}
                  checked={selectedCodebases.includes(codebase.name)}
                  onCheckedChange={(checked) => {
                    const newSelected = checked
                      ? [...selectedCodebases, codebase.name]
                      : selectedCodebases.filter((c) => c !== codebase.name);
                    onSelectedCodebasesChange(newSelected);
                  }}
                  className="mr-2"
                />
                <label
                  htmlFor={`codebase-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {codebase.name}
                </label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCodebase(codebase.url)}
                className="p-0 h-6 w-6 text-white hover:text-red-400 hover:bg-transparent"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
