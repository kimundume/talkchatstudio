"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
};

type ChatWidgetProps = {
  chatbot: {
    id: string;
    name: string;
    settings: any;
  };
};

export function ChatWidget({ chatbot }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorId] = useState(() => {
    // Get or create visitor ID
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("tchat_visitor_id");
      if (!id) {
        id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("tchat_visitor_id", id);
      }
      return id;
    }
    return `visitor_${Date.now()}`;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const settings = chatbot.settings || {};
  const primaryColor = settings.primaryColor || "#FF8C42";
  const secondaryColor = settings.secondaryColor || "#3D2E5C";
  const position = settings.position || "bottom-right";
  const placeholder = settings.placeholder || "Type your message...";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const initConversation = useCallback(async () => {
    if (!isOpen || conversationId) return;
    
    try {
      const response = await fetch("/api/widget/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId: chatbot.id,
          visitorId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConversationId(data.conversation.id);
        setMessages(data.conversation.messages);
      }
    } catch (error) {
      console.error("Failed to init conversation:", error);
    }
  }, [isOpen, conversationId, chatbot.id, visitorId]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !conversationId) return;

    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      content: inputValue,
      sender: "VISITOR",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInputValue("");

    try {
      const response = await fetch("/api/widget/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: inputValue.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Replace temp message with real one
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempMessage.id ? data.message : msg))
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const positionClasses = position === "bottom-right" 
    ? "bottom-4 right-4" 
    : "bottom-4 left-4";

  return (
    <div className={`fixed ${positionClasses} z-[9999] font-sans`}>
      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div 
          className="mb-4 w-[380px] h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden bg-white animate-in slide-in-from-bottom-5"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          {/* Header */}
          <div 
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: secondaryColor }}
              >
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{chatbot.name}</h3>
                <p className="text-xs opacity-90">We're here to help</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="hover:bg-white/20 rounded p-1.5 transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => {
              const isVisitor = message.sender === "VISITOR";
              return (
                <div
                  key={message.id}
                  className={`flex gap-2 mb-4 ${isVisitor ? "justify-end" : "justify-start"}`}
                >
                  {!isVisitor && (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[75%] ${
                      isVisitor
                        ? "text-white rounded-br-sm"
                        : "bg-white shadow-sm rounded-bl-sm"
                    }`}
                    style={isVisitor ? { backgroundColor: primaryColor } : {}}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                style={{ backgroundColor: primaryColor }}
                className="text-white hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by TalkChat Studio
            </p>
          </div>
        </div>
      )}

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <div
          className="mb-4 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-3 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => setIsMinimized(false)}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="font-medium">{chatbot.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              setIsMinimized(false);
            }}
            className="ml-2 hover:bg-gray-100 rounded p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}
