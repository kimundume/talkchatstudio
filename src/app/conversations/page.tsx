import { getConversations } from "@/app/actions/conversation";
import { getChatbots } from "@/app/actions/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Filter } from "lucide-react";
import { ConversationList } from "@/components/conversations/ConversationList";
import { ConversationFilters } from "@/components/conversations/ConversationFilters";

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; chatbot?: string; search?: string }>;
}) {
  // Await searchParams (Next.js 15+)
  const params = await searchParams;
  
  const [conversationsResult, chatbotsResult] = await Promise.all([
    getConversations({
      status: params.status,
      chatbotId: params.chatbot,
      search: params.search,
    }),
    getChatbots(),
  ]);

  if (conversationsResult.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{conversationsResult.error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const conversations = conversationsResult.conversations || [];
  const chatbots = chatbotsResult.chatbots || [];

  // Calculate stats
  const stats = {
    total: conversations.length,
    open: conversations.filter((c) => c.status === "OPEN").length,
    assigned: conversations.filter((c) => c.status === "ASSIGNED").length,
    resolved: conversations.filter((c) => c.status === "RESOLVED").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Conversations</h2>
          <p className="text-muted-foreground">
            Manage and respond to customer conversations
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assigned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <ConversationFilters chatbots={chatbots} />

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <MessageCircle className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              When customers start chatting with your chatbots, their conversations will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ConversationList conversations={conversations} />
      )}
    </div>
  );
}
