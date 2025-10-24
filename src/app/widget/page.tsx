"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatWidget } from "@/components/widget/ChatWidget";

// Wrap the main component with Suspense
function WidgetContent() {
  const searchParams = useSearchParams();
  const embedCode = searchParams.get("embed");
  const [chatbot, setChatbot] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Handle widget initialization
  useEffect(() => {
    if (!embedCode) {
      setError("No embed code provided");
      setLoading(false);
      return;
    }

    // Initialize widget
    const initWidget = async () => {
      try {
        const response = await fetch(`/api/widget/init?embedCode=${embedCode}`);
        const data = await response.json();
        
        if (data.success) {
          setChatbot(data.chatbot);
        } else {
          setError(data.error || "Failed to load chatbot");
        }
      } catch (err) {
        setError("Failed to connect to chatbot");
        console.error("Widget initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initWidget();
  }, [embedCode]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error || !chatbot) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Chatbot</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Render the chat widget
  return <ChatWidget chatbot={chatbot} />;
}

// Main page component with Suspense boundary
export default function WidgetPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <WidgetContent />
    </Suspense>
  );
}
