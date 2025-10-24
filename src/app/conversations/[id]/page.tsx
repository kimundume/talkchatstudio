import { getConversation } from "@/app/actions/conversation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageList } from "@/components/conversations/MessageList";
import { MessageInput } from "@/components/conversations/MessageInput";
import { ConversationActions } from "@/components/conversations/ConversationActions";
import { format } from "date-fns";

const statusColors = {
  OPEN: "bg-blue-500",
  ASSIGNED: "bg-yellow-500",
  RESOLVED: "bg-green-500",
  CLOSED: "bg-gray-500",
};

const statusLabels = {
  OPEN: "Open",
  ASSIGNED: "Assigned",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export default async function ConversationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getConversation(params.id);

  if (result.error || !result.conversation) {
    notFound();
  }

  const conversation = result.conversation;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/conversations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">
                {conversation.visitorName || "Anonymous"}
              </h2>
              <Badge
                className={`${statusColors[conversation.status as keyof typeof statusColors]} text-white`}
              >
                {statusLabels[conversation.status as keyof typeof statusLabels]}
              </Badge>
            </div>
            {conversation.visitorEmail && (
              <p className="text-sm text-muted-foreground">
                {conversation.visitorEmail}
              </p>
            )}
          </div>
        </div>
        <ConversationActions conversation={conversation} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversation
              </CardTitle>
              <CardDescription>
                Started {format(new Date(conversation.createdAt), "PPp")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
              <MessageList messages={conversation.messages} />
              <MessageInput conversationId={conversation.id} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 overflow-y-auto">
          {/* Visitor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Visitor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Name:</span>
                <span className="text-muted-foreground">
                  {conversation.visitorName || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span className="text-muted-foreground">
                  {conversation.visitorEmail || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Started:</span>
                <span className="text-muted-foreground">
                  {format(new Date(conversation.createdAt), "PP")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Chatbot Info */}
          {conversation.chatbot && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chatbot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="font-medium">{conversation.chatbot.name}</span>
                </div>
                <Link href={`/chatbots/${conversation.chatbot.id}`}>
                  <Button variant="link" className="p-0 h-auto text-xs mt-2">
                    View Chatbot Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Assignment Info */}
          {conversation.assignments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                {conversation.assignments.map((assignment) => (
                  <div key={assignment.user.id} className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {assignment.user.name || assignment.user.email}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {conversation.metadata && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Additional Info</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(conversation.metadata, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
