"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { MessageCircle, User, Clock } from "lucide-react";

type Conversation = {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  chatbot: {
    id: string;
    name: string;
  } | null;
  messages: Array<{
    id: string;
    content: string;
    sender: string;
    createdAt: Date;
  }>;
  assignments: Array<{
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }>;
  _count: {
    messages: number;
  };
};

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

export function ConversationList({ conversations }: { conversations: Conversation[] }) {
  return (
    <div className="space-y-3">
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages[0];
        const assignedUser = conversation.assignments[0]?.user;

        return (
          <Link key={conversation.id} href={`/conversations/${conversation.id}`}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {conversation.visitorName?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">
                        {conversation.visitorName || "Anonymous"}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`${statusColors[conversation.status as keyof typeof statusColors]} text-white`}
                      >
                        {statusLabels[conversation.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                    </span>
                  </div>

                  {conversation.visitorEmail && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {conversation.visitorEmail}
                    </p>
                  )}

                  {lastMessage && (
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {lastMessage.sender === "VISITOR" ? "👤 " : "👨‍💼 "}
                      {lastMessage.content}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {conversation.chatbot && (
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{conversation.chatbot.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{conversation._count.messages} messages</span>
                    </div>
                    {assignedUser && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Assigned to {assignedUser.name || assignedUser.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
