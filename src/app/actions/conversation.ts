"use server";

import { prisma } from "@/lib/db/prisma";
import { requireTenant } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";

export async function getConversations(filters?: {
  status?: string;
  chatbotId?: string;
  search?: string;
}) {
  try {
    const user = await requireTenant();

    const where: any = {
      tenantId: user.tenantId!,
    };

    if (filters?.status && filters.status !== "all") {
      where.status = filters.status.toUpperCase();
    }

    if (filters?.chatbotId) {
      where.chatbotId = filters.chatbotId;
    }

    if (filters?.search) {
      where.OR = [
        { visitorName: { contains: filters.search, mode: "insensitive" } },
        { visitorEmail: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const conversations = await prisma.conversation.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        chatbot: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    return { success: true, conversations };
  } catch (error) {
    console.error("Get conversations error:", error);
    return { error: "Failed to fetch conversations" };
  }
}

export async function getConversation(id: string) {
  try {
    const user = await requireTenant();

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        tenantId: user.tenantId!,
      },
      include: {
        chatbot: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return { error: "Conversation not found" };
    }

    return { success: true, conversation };
  } catch (error) {
    console.error("Get conversation error:", error);
    return { error: "Failed to fetch conversation" };
  }
}

export async function sendMessage(data: {
  conversationId: string;
  content: string;
}) {
  try {
    const user = await requireTenant();

    // Verify conversation belongs to user's tenant
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: data.conversationId,
        tenantId: user.tenantId!,
      },
    });

    if (!conversation) {
      return { error: "Conversation not found" };
    }

    const message = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        content: data.content,
        sender: "AGENT",
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    });

    revalidatePath(`/conversations/${data.conversationId}`);
    revalidatePath("/conversations");

    return { success: true, message };
  } catch (error) {
    console.error("Send message error:", error);
    return { error: "Failed to send message" };
  }
}

export async function updateConversationStatus(
  conversationId: string,
  status: "OPEN" | "ASSIGNED" | "RESOLVED" | "CLOSED"
) {
  try {
    const user = await requireTenant();

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        tenantId: user.tenantId!,
      },
    });

    if (!conversation) {
      return { error: "Conversation not found" };
    }

    const updated = await prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });

    revalidatePath(`/conversations/${conversationId}`);
    revalidatePath("/conversations");

    return { success: true, conversation: updated };
  } catch (error) {
    console.error("Update conversation status error:", error);
    return { error: "Failed to update conversation status" };
  }
}

export async function assignConversation(
  conversationId: string,
  userId: string
) {
  try {
    const user = await requireTenant();

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        tenantId: user.tenantId!,
      },
    });

    if (!conversation) {
      return { error: "Conversation not found" };
    }

    // Remove existing assignments
    await prisma.chatAssignment.deleteMany({
      where: { conversationId },
    });

    // Create new assignment
    await prisma.chatAssignment.create({
      data: {
        conversationId,
        userId,
      },
    });

    // Update conversation status to ASSIGNED
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { status: "ASSIGNED" },
    });

    revalidatePath(`/conversations/${conversationId}`);
    revalidatePath("/conversations");

    return { success: true };
  } catch (error) {
    console.error("Assign conversation error:", error);
    return { error: "Failed to assign conversation" };
  }
}
