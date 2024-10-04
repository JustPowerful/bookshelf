"use client";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot, Send } from "lucide-react";

type Message = {
  text: string;
  sender: "user" | "ai";
};

export default function BookshelfChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedBookshelf, setSelectedBookshelf] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  async function fetchBookshelves() {
    try {
      const response = await fetch("/api/bookshelf");
      const data = await response.json();
      return data.bookshelves;
    } catch (error) {
      throw error;
    }
  }
  const { data: bookshelves, isFetching: isBookshelvesFetching } = useQuery({
    queryKey: ["bookshelves"],
    queryFn: fetchBookshelves,
    refetchOnWindowFocus: false,
  });

  const { refetch: sendMessage, isFetching } = useQuery({
    queryKey: ["chatMessage"],
    queryFn: async () => {
      setIsStreaming(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookshelfId: selectedBookshelf,
          question: inputMessage,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let aiResponse = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          const parsedLines = lines
            .map((line) => line.replace(/^data: /, "").trim())
            .filter((line) => line !== "" && line !== "[DONE]")
            .map((line) => JSON.parse(line));

          for (const parsedLine of parsedLines) {
            aiResponse += parsedLine.content;
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { text: aiResponse, sender: "ai" },
            ]);
          }
        }
      }
      setIsStreaming(false);
    },
    enabled: false,
  });

  const handleSendMessage = () => {
    if (inputMessage.trim() === "" || !selectedBookshelf) return;

    setMessages((prev) => [...prev, { text: inputMessage, sender: "user" }]);
    setMessages((prev) => [...prev, { text: "", sender: "ai" }]);
    sendMessage();
    setInputMessage("");
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bookshelf Chat</h1>

      <ScrollArea
        className="flex-grow mb-4 p-4 border rounded-md"
        ref={scrollAreaRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start mb-4 ${
              message.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex-shrink-0 ${
                message.sender === "user" ? "ml-2" : "mr-2"
              }`}
            >
              {message.sender === "user" ? (
                <User className="h-8 w-8 text-blue-500" />
              ) : (
                <Bot className="h-8 w-8 text-green-500" />
              )}
            </div>
            <div
              className={`p-3 rounded-lg ${
                message.sender === "user" ? "bg-blue-100" : "bg-gray-100"
              } max-w-[70%]`}
            >
              {message.text}
              {message.sender === "ai" && isStreaming && (
                <span className="inline-block animate-pulse">▋</span>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>

      <div className="flex space-x-2">
        <Select onValueChange={setSelectedBookshelf}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Bookshelf" />
          </SelectTrigger>
          <SelectContent>
            {isBookshelvesFetching ? (
              <p>Loading...</p>
            ) : (
              bookshelves?.map((bookshelf: any) => (
                <SelectItem key={bookshelf.id} value={bookshelf.id}>
                  {bookshelf.title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-grow"
          disabled={isFetching}
        />

        <Button
          onClick={handleSendMessage}
          className="px-3"
          disabled={isFetching || !selectedBookshelf}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
