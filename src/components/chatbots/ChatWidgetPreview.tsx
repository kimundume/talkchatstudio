"use client";

import { MessageCircle, X, Send } from "lucide-react";
import { useState } from "react";

type ChatWidgetPreviewProps = {
  primaryColor: string;
  secondaryColor: string;
  position: "bottom-right" | "bottom-left";
  greeting: string;
  placeholder: string;
};

export function ChatWidgetPreview({
  primaryColor,
  secondaryColor,
  position,
  greeting,
  placeholder,
}: ChatWidgetPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = position === "bottom-right" 
    ? "right-4 bottom-4" 
    : "left-4 bottom-4";

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8 h-[600px] border">
      {/* Simulated website content */}
      <div className="space-y-4 opacity-50">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Chat Widget */}
      <div className={`fixed ${positionClasses} z-50`}>
        {/* Chat Window */}
        {isOpen && (
          <div 
            className="mb-4 w-[350px] h-[500px] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5"
            style={{ backgroundColor: "white" }}
          >
            {/* Header */}
            <div 
              className="p-4 text-white flex items-center justify-between"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Chat with us</h3>
                  <p className="text-xs opacity-90">We're online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="flex gap-2 mb-4">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div 
                  className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[80%]"
                >
                  <p className="text-sm">{greeting}</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={placeholder}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    focusRing: primaryColor,
                    borderColor: "#e5e7eb"
                  }}
                  disabled
                />
                <button
                  className="p-2 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: primaryColor }}
                  disabled
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
          style={{ backgroundColor: primaryColor }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
