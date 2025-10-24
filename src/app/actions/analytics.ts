"use server";

import { prisma } from "@/lib/db/prisma";
import { requireTenant } from "@/lib/auth/utils";

export async function getAnalytics(period: "7d" | "30d" | "90d" = "30d") {
  try {
    const user = await requireTenant();

    const daysAgo = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Total conversations
    const totalConversations = await prisma.conversation.count({
      where: {
        tenantId: user.tenantId!,
        createdAt: { gte: startDate },
      },
    });

    // Conversations by status
    const conversationsByStatus = await prisma.conversation.groupBy({
      by: ["status"],
      where: {
        tenantId: user.tenantId!,
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    // Total messages
    const totalMessages = await prisma.message.count({
      where: {
        conversation: {
          tenantId: user.tenantId!,
        },
        createdAt: { gte: startDate },
      },
    });

    // Messages by sender (visitor vs agent)
    const messagesBySender = await prisma.message.groupBy({
      by: ["isFromVisitor"],
      where: {
        conversation: {
          tenantId: user.tenantId!,
        },
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    // Average response time (simplified)
    const conversations = await prisma.conversation.findMany({
      where: {
        tenantId: user.tenantId!,
        createdAt: { gte: startDate },
        status: "RESOLVED",
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    const avgResponseTime = conversations.length > 0
      ? conversations.reduce((acc, conv) => {
          const diff = conv.updatedAt.getTime() - conv.createdAt.getTime();
          return acc + diff;
        }, 0) / conversations.length
      : 0;

    // Conversations per chatbot
    const conversationsPerChatbot = await prisma.conversation.groupBy({
      by: ["chatbotId"],
      where: {
        tenantId: user.tenantId!,
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    const chatbotIds = conversationsPerChatbot.map((c) => c.chatbotId);
    const chatbots = await prisma.chatbot.findMany({
      where: { id: { in: chatbotIds } },
      select: { id: true, name: true },
    });

    const chatbotStats = conversationsPerChatbot.map((stat) => ({
      chatbot: chatbots.find((c) => c.id === stat.chatbotId)?.name || "Unknown",
      count: stat._count,
    }));

    // Daily conversation trend
    const dailyConversations = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "Conversation"
      WHERE "tenantId" = ${user.tenantId}
        AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    return {
      success: true,
      analytics: {
        totalConversations,
        conversationsByStatus: conversationsByStatus.map((s) => ({
          status: s.status,
          count: s._count,
        })),
        totalMessages,
        messagesBySender: messagesBySender.map((m) => ({
          sender: m.isFromVisitor ? "VISITOR" : "AGENT",
          count: m._count,
        })),
        avgResponseTimeMs: Math.round(avgResponseTime),
        avgResponseTimeHours: Math.round(avgResponseTime / (1000 * 60 * 60) * 10) / 10,
        chatbotStats,
        dailyConversations: dailyConversations.map((d) => ({
          date: d.date.toISOString().split("T")[0],
          count: Number(d.count),
        })),
      },
    };
  } catch (error) {
    console.error("Get analytics error:", error);
    return { error: "Failed to fetch analytics" };
  }
}

export async function getAgentPerformance() {
  try {
    const user = await requireTenant();

    const agents = await prisma.user.findMany({
      where: {
        tenantId: user.tenantId!,
        role: { in: ["TENANT_ADMIN", "TENANT_USER"] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            assignedChats: true,
            messages: true,
          },
        },
      },
    });

    return {
      success: true,
      agents: agents.map((agent) => ({
        id: agent.id,
        name: agent.name || agent.email || "Unknown",
        assignedChats: agent._count.assignedChats,
        messagesSent: agent._count.messages,
      })),
    };
  } catch (error) {
    console.error("Get agent performance error:", error);
    return { error: "Failed to fetch agent performance" };
  }
}
