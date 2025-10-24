import { getTriggers } from "@/app/actions/trigger";
import { getChatbots } from "@/app/actions/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Zap } from "lucide-react";
import Link from "next/link";
import { TriggerList } from "@/components/triggers/TriggerList";
import { TriggerFilter } from "@/components/triggers/TriggerFilter";

export default async function TriggersPage({
  searchParams,
}: {
  searchParams: Promise<{ chatbot?: string }>;
}) {
  // Await searchParams (Next.js 15+)
  const params = await searchParams;
  
  const [triggersResult, chatbotsResult] = await Promise.all([
    getTriggers(params.chatbot),
    getChatbots(),
  ]);

  if (triggersResult.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{triggersResult.error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const triggers = triggersResult.triggers || [];
  const chatbots = chatbotsResult.chatbots || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Triggers & Automation</h2>
          <p className="text-muted-foreground">
            Create automated responses and workflows
          </p>
        </div>
        <Link href="/triggers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Trigger
          </Button>
        </Link>
      </div>

      {/* Filter by Chatbot */}
      {chatbots.length > 0 && <TriggerFilter chatbots={chatbots} />}

      {triggers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Zap className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No triggers yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create automated responses based on keywords, time, or visitor behavior.
              Save time and provide instant answers to common questions.
            </p>
            <Link href="/triggers/new">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Trigger
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <TriggerList triggers={triggers} />
      )}
    </div>
  );
}
