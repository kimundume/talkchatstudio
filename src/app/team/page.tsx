import { getTeamMembers, getTeamStats } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, MessageCircle, CheckCircle } from "lucide-react";
import { TeamMemberList } from "@/components/team/TeamMemberList";
import { InviteMemberDialog } from "@/components/team/InviteMemberDialog";

export default async function TeamPage() {
  const [membersResult, statsResult] = await Promise.all([
    getTeamMembers(),
    getTeamStats(),
  ]);

  if (membersResult.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{membersResult.error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const members = membersResult.members || [];
  const stats = statsResult.stats || { totalMembers: 0, activeConversations: 0, resolvedToday: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team</h2>
          <p className="text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
        <InviteMemberDialog />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConversations}</div>
            <p className="text-xs text-muted-foreground">
              Open conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              Conversations closed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      {members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No team members yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Invite team members to help manage conversations and provide customer support.
            </p>
            <InviteMemberDialog />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage roles and permissions for your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMemberList members={members} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
