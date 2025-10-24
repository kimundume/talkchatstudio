import { getChatbots } from "@/app/actions/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ChatbotList } from "@/components/chatbots/ChatbotList";

export default async function ChatbotsPage() {
  const result = await getChatbots();

  if (result.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{result.error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const chatbots = result.chatbots || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chatbots</h2>
          <p className="text-muted-foreground">
            Create and manage your chatbots
          </p>
        </div>
        <Link href="/chatbots/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Chatbot
          </Button>
        </Link>
      </div>

      {chatbots.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Plus className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No chatbots yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get started by creating your first chatbot. Customize its appearance,
              set up automated responses, and embed it on your website.
            </p>
            <Link href="/chatbots/new">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Chatbot
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ChatbotList chatbots={chatbots} />
      )}
    </div>
  );
}
