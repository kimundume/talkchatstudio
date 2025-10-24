"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Settings, 
  Trash2, 
  Copy, 
  Eye,
  Power,
  MessageCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toggleChatbotStatus, deleteChatbot } from "@/app/actions/chatbot";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Chatbot = {
  id: string;
  name: string;
  description: string | null;
  embedCode: string;
  isActive: boolean;
  createdAt: Date;
  _count: {
    conversations: number;
  };
};

export function ChatbotList({ chatbots }: { chatbots: Chatbot[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (id: string) => {
    setLoadingId(id);
    await toggleChatbotStatus(id);
    setLoadingId(null);
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      setLoadingId(id);
      await deleteChatbot(id);
      setLoadingId(null);
      router.refresh();
    }
  };

  const copyEmbedCode = (embedCode: string) => {
    const code = `<script src="https://cdn.talkchat.studio/widget.js" data-chatbot="${embedCode}"></script>`;
    navigator.clipboard.writeText(code);
    // TODO: Add toast notification
    alert("Embed code copied to clipboard!");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {chatbots.map((chatbot) => (
        <Card key={chatbot.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {chatbot.name}
                  {chatbot.isActive ? (
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </CardTitle>
                <CardDescription className="mt-1.5">
                  {chatbot.description || "No description"}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    disabled={loadingId === chatbot.id}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/chatbots/${chatbot.id}`} className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/chatbots/${chatbot.id}/settings`} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyEmbedCode(chatbot.embedCode)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Embed Code
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleToggleStatus(chatbot.id)}
                    disabled={loadingId === chatbot.id}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    {chatbot.isActive ? "Deactivate" : "Activate"}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(chatbot.id, chatbot.name)}
                    className="text-destructive focus:text-destructive"
                    disabled={loadingId === chatbot.id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>{chatbot._count.conversations} conversations</span>
              </div>
              <Link href={`/chatbots/${chatbot.id}`}>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Embed Code: <code className="bg-muted px-1 py-0.5 rounded">{chatbot.embedCode}</code>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
