import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth/utils';
import { getAnalytics, getAgentPerformance } from '@/app/actions/analytics';
import { MessageCircle, Users, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  // Fetch analytics with error handling
  const analyticsResult = await getAnalytics("30d").catch(() => ({ 
    error: "Failed to load analytics",
    analytics: null 
  }));
  
  const agentResult = await getAgentPerformance().catch(() => ({ 
    error: "Failed to load team data",
    agents: [] 
  }));
  
  const analytics = analyticsResult.analytics || {
    totalConversations: 0,
    conversationsByStatus: [],
    totalMessages: 0,
    avgResponseTimeHours: 0,
    chatbotStats: [],
  };

  const agents = agentResult.agents || [];

  const openChats = analytics.conversationsByStatus.find((s: any) => s.status === "OPEN")?._count || 0;
  const resolvedChats = analytics.conversationsByStatus.find((s: any) => s.status === "RESOLVED")?._count || 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back{user?.name ? `, ${user.name}` : ''}!</h2>
        <p className="text-muted-foreground">
          {user?.tenantName ? `${user.tenantName} - ` : ''}Here's what's happening with your chatbots today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConversations}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Chats</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openChats}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedChats}</div>
            <p className="text-xs text-muted-foreground">Successfully closed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgResponseTimeHours}h</div>
            <p className="text-xs text-muted-foreground">Time to resolution</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Chatbot Performance</CardTitle>
            <CardDescription>Conversations per chatbot</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.chatbotStats && analytics.chatbotStats.length > 0 ? (
              <div className="space-y-4">
                {analytics.chatbotStats.map((stat: any, i: number) => (
                  <div key={i} className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stat.chatbot}</p>
                      <div className="mt-1 h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(stat.count / analytics.totalConversations) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-sm font-bold">{stat.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">No chatbot data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Agent activity</CardDescription>
          </CardHeader>
          <CardContent>
            {agents.length > 0 ? (
              <div className="space-y-4">
                {agents.slice(0, 5).map((agent: any) => (
                  <div key={agent.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {agent.messagesSent} messages • {agent.assignedChats} chats
                      </p>
                    </div>
                  </div>
                ))}
                <Link href="/team">
                  <Button variant="outline" className="w-full mt-4">
                    <Users className="mr-2 h-4 w-4" />
                    View All Team Members
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">No team members yet</p>
                <Link href="/team">
                  <Button>Invite Team Members</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/chatbots/new">
            <Button variant="outline">Create Chatbot</Button>
          </Link>
          <Link href="/conversations">
            <Button variant="outline">View Conversations</Button>
          </Link>
          <Link href="/triggers/new">
            <Button variant="outline">Create Trigger</Button>
          </Link>
          <Link href="/team">
            <Button variant="outline">Manage Team</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
