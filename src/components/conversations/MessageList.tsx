"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
};

export function MessageList({ messages }: { messages: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isAgent = message.sender === "AGENT" || message.sender === "BOT";
        const isBot = message.sender === "BOT";

        return (
          <div
            key={message.id}
            className={`flex gap-3 ${isAgent ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <Avatar className="h-8 w-8 flex-shrink-0">
              {isAgent ? (
                message.user?.image ? (
                  <AvatarImage src={message.user.image} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {message.user?.name?.[0]?.toUpperCase() || "A"}
                  </AvatarFallback>
                )
              ) : (
                <AvatarFallback className="bg-muted">
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Message */}
            <div className={`flex flex-col ${isAgent ? "items-end" : "items-start"} max-w-[70%]`}>
              <div
                className={`rounded-lg px-4 py-2 ${
                  isAgent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {format(new Date(message.createdAt), "p")}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
