"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Chatbot = {
  id: string;
  name: string;
};

export function TriggerFilter({ chatbots }: { chatbots: Chatbot[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentChatbot = searchParams.get("chatbot") || "all";

  const handleChange = (value: string) => {
    if (value === "all") {
      router.push("/triggers");
    } else {
      router.push(`/triggers?chatbot=${value}`);
    }
  };

  return (
    <div className="flex gap-2">
      <select
        value={currentChatbot}
        onChange={(e) => handleChange(e.target.value)}
        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="all">All Chatbots</option>
        {chatbots.map((chatbot) => (
          <option key={chatbot.id} value={chatbot.id}>
            {chatbot.name}
          </option>
        ))}
      </select>
    </div>
  );
}
