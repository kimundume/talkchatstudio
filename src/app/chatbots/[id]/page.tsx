import { getChatbot } from "@/app/actions/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Copy, Code, MessageCircle, Zap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyEmbedCode } from "@/components/chatbots/CopyEmbedCode";

export default async function ChatbotDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getChatbot(params.id);

  if (result.error || !result.chatbot) {
    notFound();
  }

  const chatbot = result.chatbot;
  const settings = chatbot.settings as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/chatbots">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">{chatbot.name}</h2>
              {chatbot.isActive ? (
                <Badge className="bg-green-500">Active</Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {chatbot.description || "No description"}
            </p>
          </div>
        </div>
        <Link href={`/chatbots/${chatbot.id}/settings`}>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatbot._count.conversations}</div>
            <p className="text-xs text-muted-foreground">
              All time conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Triggers</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatbot._count.triggers}</div>
            <p className="text-xs text-muted-foreground">
              Automation rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatbot.isActive ? "Live" : "Paused"}</div>
            <p className="text-xs text-muted-foreground">
              Current state
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
          <CardDescription>
            Copy this code and paste it before the closing &lt;/body&gt; tag on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CopyEmbedCode embedCode={chatbot.embedCode} />
        </CardContent>
      </Card>

      {/* Appearance Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Current widget customization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Primary Color</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {settings.primaryColor}
                  </code>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Secondary Color</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: settings.secondaryColor }}
                  />
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {settings.secondaryColor}
                  </code>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Position</span>
                <Badge variant="outline">
                  {settings.position === "bottom-right" ? "Bottom Right" : "Bottom Left"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Greeting Message</span>
                <p className="text-sm text-muted-foreground mt-1">
                  "{settings.greeting}"
                </p>
              </div>

              <div>
                <span className="text-sm font-medium">Input Placeholder</span>
                <p className="text-sm text-muted-foreground mt-1">
                  "{settings.placeholder}"
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your chatbot
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Link href={`/chatbots/${chatbot.id}/settings`}>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Edit Settings
            </Button>
          </Link>
          <Link href={`/conversations?chatbot=${chatbot.id}`}>
            <Button variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              View Conversations
            </Button>
          </Link>
          <Link href={`/triggers?chatbot=${chatbot.id}`}>
            <Button variant="outline">
              <Zap className="mr-2 h-4 w-4" />
              Manage Triggers
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
