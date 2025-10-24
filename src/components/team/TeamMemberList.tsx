"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeTeamMember } from "@/app/actions/team";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";

type TeamMember = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
  _count: {
    assignedChats: number;
  };
};

const roleLabels = {
  TENANT_ADMIN: "Admin",
  TENANT_USER: "Agent",
  SUPERADMIN: "Super Admin",
  SUPERADMIN_SUPPORT: "Support",
};

const roleColors = {
  TENANT_ADMIN: "bg-purple-500",
  TENANT_USER: "bg-blue-500",
  SUPERADMIN: "bg-red-500",
  SUPERADMIN_SUPPORT: "bg-orange-500",
};

export function TeamMemberList({ members }: { members: TeamMember[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRemove = async (id: string, name: string | null) => {
    if (confirm(`Are you sure you want to remove ${name || "this member"}? They will lose access immediately.`)) {
      setLoadingId(id);
      const result = await removeTeamMember(id);
      if (result.error) {
        alert(result.error);
      }
      setLoadingId(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.image || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {member.name?.[0]?.toUpperCase() || member.email?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{member.name || "Unnamed"}</h4>
                <Badge
                  className={`${roleColors[member.role as keyof typeof roleColors]} text-white`}
                >
                  {roleLabels[member.role as keyof typeof roleLabels]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{member.email}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span>Joined {format(new Date(member.createdAt), "PP")}</span>
                <span>•</span>
                <span>{member._count.assignedChats} assigned chats</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={loadingId === member.id}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <Shield className="mr-2 h-4 w-4" />
                Change Role (Coming Soon)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleRemove(member.id, member.name)}
                className="text-destructive focus:text-destructive"
                disabled={loadingId === member.id}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove from Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
