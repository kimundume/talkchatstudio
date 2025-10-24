"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Settings, 
  Trash2,
  Power,
  Zap,
  Clock,
  MessageSquare,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toggleTriggerStatus, deleteTrigger } from "@/app/actions/trigger";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Trigger = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  isActive: boolean;
  chatbot: {
    id: string;
    name: string;
  };
};

const triggerIcons = {
  KEYWORD: MessageSquare,
  WELCOME: Sparkles,
  TIME_BASED: Clock,
  CUSTOM: Zap,
};

const triggerLabels = {
  KEYWORD: "Keyword",
  WELCOME: "Welcome",
  TIME_BASED: "Time-Based",
  CUSTOM: "Custom",
};

export function TriggerList({ triggers }: { triggers: Trigger[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (id: string) => {
    setLoadingId(id);
    await toggleTriggerStatus(id);
    setLoadingId(null);
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      setLoadingId(id);
      await deleteTrigger(id);
      setLoadingId(null);
      router.refresh();
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {triggers.map((trigger) => {
        const Icon = triggerIcons[trigger.type as keyof typeof triggerIcons] || Zap;
        
        return (
          <Card key={trigger.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-primary" />
                    <Badge variant="outline">
                      {triggerLabels[trigger.type as keyof typeof triggerLabels]}
                    </Badge>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    {trigger.name}
                    {trigger.isActive ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    {trigger.description || "No description"}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      disabled={loadingId === trigger.id}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/triggers/${trigger.id}`} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Trigger
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleToggleStatus(trigger.id)}
                      disabled={loadingId === trigger.id}
                    >
                      <Power className="mr-2 h-4 w-4" />
                      {trigger.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(trigger.id, trigger.name)}
                      className="text-destructive focus:text-destructive"
                      disabled={loadingId === trigger.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <Zap className="h-3 w-3 inline mr-1" />
                Chatbot: {trigger.chatbot.name}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
