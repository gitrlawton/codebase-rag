"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatInterface({ selectedCodebases }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim() && selectedCodebases.length > 0) {
      const newMessage = { role: "user", content: input };
      setMessages([...messages, newMessage]);
      setInput("");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, codebases: selectedCodebases }),
      });
      const data = await response.json();

      const assistantMessage = { role: "assistant", content: data.response };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    }
  };

  return (
    <Card className="w-full lg:w-2/3 bg-white/10 backdrop-blur-lg border-none text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Chat Interface</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[50vh] mb-4 p-4 rounded bg-black/30">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/30 text-white"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
        </ScrollArea>
        <div className="flex">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="mr-2 bg-white/80 border-none text-black placeholder-white/60 caret-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            variant="secondary"
            className="bg-cyan-800 hover:bg-cyan-900 text-white"
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
