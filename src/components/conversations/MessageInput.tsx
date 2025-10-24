"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { sendMessage } from "@/app/actions/conversation";
import { useRouter } from "next/navigation";

export function MessageInput({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    const result = await sendMessage({
      conversationId,
      content: message.trim(),
    });

    if (result.success) {
      setMessage("");
      router.refresh();
    } else {
      alert(result.error || "Failed to send message");
    }
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          className="min-h-[60px] max-h-[120px] resize-none"
          disabled={isSending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isSending}
          className="h-[60px] w-[60px]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
