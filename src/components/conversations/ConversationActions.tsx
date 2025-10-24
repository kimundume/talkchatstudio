"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, CheckCircle, XCircle, UserPlus, Archive } from "lucide-react";
import { updateConversationStatus } from "@/app/actions/conversation";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Conversation = {
  id: string;
  status: string;
};

export function ConversationActions({ conversation }: { conversation: Conversation }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: "OPEN" | "ASSIGNED" | "RESOLVED" | "CLOSED") => {
    setIsLoading(true);
    const result = await updateConversationStatus(conversation.id, status);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to update status");
    }
    setIsLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={isLoading}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleStatusChange("OPEN")}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark as Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("ASSIGNED")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Mark as Assigned
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("RESOLVED")}>
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          Mark as Resolved
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleStatusChange("CLOSED")}>
          <Archive className="mr-2 h-4 w-4" />
          Close Conversation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
