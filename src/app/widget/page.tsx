"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatWidget } from "@/components/widget/ChatWidget";

export default function WidgetPage() {
  const searchParams = useSearchParams();
  const embedCode = searchParams.get("embed");
  const [chatbot, setChatbot] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!embedCode) {
      setError("No embed code provided");
      setLoading(false);
      return;
    }

    // Initialize widget
    fetch(`/api/widget/init?embedCode=${embedCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setChatbot(data.chatbot);
        } else {
          setError(data.error || "Failed to load chatbot");
        }
      })
      .catch((err) => {
        setError("Failed to connect to chatbot");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [embedCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !chatbot) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load chat</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return <ChatWidget chatbot={chatbot} />;
}
