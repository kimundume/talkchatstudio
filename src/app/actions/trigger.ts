"use server";

import { prisma } from "@/lib/db/prisma";
import { requireTenant } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";

export async function createTrigger(data: {
  name: string;
  description?: string;
  chatbotId: string;
  type: string;
  conditions: any;
  actions: any;
  isActive: boolean;
}) {
  try {
    const user = await requireTenant();

    // Verify chatbot belongs to user's tenant
    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: data.chatbotId,
        tenantId: user.tenantId!,
      },
    });

    if (!chatbot) {
      return { error: "Chatbot not found" };
    }

    const trigger = await prisma.trigger.create({
      data: {
        name: data.name,
        description: data.description,
        chatbotId: data.chatbotId,
        type: data.type,
        conditions: data.conditions,
        actions: data.actions,
        isActive: data.isActive,
      },
    });

    revalidatePath("/triggers");
    return { success: true, trigger };
  } catch (error) {
    console.error("Create trigger error:", error);
    return { error: "Failed to create trigger" };
  }
}

export async function updateTrigger(
  id: string,
  data: {
    name?: string;
    description?: string;
    type?: string;
    conditions?: any;
    actions?: any;
    isActive?: boolean;
  }
) {
  try {
    const user = await requireTenant();

    // Verify trigger belongs to user's tenant
    const existingTrigger = await prisma.trigger.findFirst({
      where: { id },
      include: {
        chatbot: {
          select: { tenantId: true },
        },
      },
    });

    if (!existingTrigger || existingTrigger.chatbot.tenantId !== user.tenantId) {
      return { error: "Trigger not found" };
    }

    const trigger = await prisma.trigger.update({
      where: { id },
      data,
    });

    revalidatePath("/triggers");
    revalidatePath(`/triggers/${id}`);
    return { success: true, trigger };
  } catch (error) {
    console.error("Update trigger error:", error);
    return { error: "Failed to update trigger" };
  }
}

export async function deleteTrigger(id: string) {
  try {
    const user = await requireTenant();

    const trigger = await prisma.trigger.findFirst({
      where: { id },
      include: {
        chatbot: {
          select: { tenantId: true },
        },
      },
    });

    if (!trigger || trigger.chatbot.tenantId !== user.tenantId) {
      return { error: "Trigger not found" };
    }

    await prisma.trigger.delete({
      where: { id },
    });

    revalidatePath("/triggers");
    return { success: true };
  } catch (error) {
    console.error("Delete trigger error:", error);
    return { error: "Failed to delete trigger" };
  }
}

export async function toggleTriggerStatus(id: string) {
  try {
    const user = await requireTenant();

    const trigger = await prisma.trigger.findFirst({
      where: { id },
      include: {
        chatbot: {
          select: { tenantId: true },
        },
      },
    });

    if (!trigger || trigger.chatbot.tenantId !== user.tenantId) {
      return { error: "Trigger not found" };
    }

    const updated = await prisma.trigger.update({
      where: { id },
      data: {
        isActive: !trigger.isActive,
      },
    });

    revalidatePath("/triggers");
    return { success: true, isActive: updated.isActive };
  } catch (error) {
    console.error("Toggle trigger status error:", error);
    return { error: "Failed to toggle trigger status" };
  }
}

export async function getTriggers(chatbotId?: string) {
  try {
    const user = await requireTenant();

    const where: any = {
      chatbot: {
        tenantId: user.tenantId!,
      },
    };

    if (chatbotId) {
      where.chatbotId = chatbotId;
    }

    const triggers = await prisma.trigger.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        chatbot: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return { success: true, triggers };
  } catch (error) {
    console.error("Get triggers error:", error);
    return { error: "Failed to fetch triggers" };
  }
}

export async function getTrigger(id: string) {
  try {
    const user = await requireTenant();

    const trigger = await prisma.trigger.findFirst({
      where: {
        id,
        chatbot: {
          tenantId: user.tenantId!,
        },
      },
      include: {
        chatbot: true,
      },
    });

    if (!trigger) {
      return { error: "Trigger not found" };
    }

    return { success: true, trigger };
  } catch (error) {
    console.error("Get trigger error:", error);
    return { error: "Failed to fetch trigger" };
  }
}

// Execute triggers for a conversation
export async function executeTriggers(conversationId: string, messageContent: string) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        chatbot: {
          include: {
            triggers: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!conversation) return;

    for (const trigger of conversation.chatbot.triggers) {
      const conditions = trigger.conditions as any;
      const actions = trigger.actions as any;

      let shouldExecute = false;

      // Check trigger type and conditions
      if (trigger.type === "KEYWORD") {
        const keywords = conditions.keywords || [];
        shouldExecute = keywords.some((keyword: string) =>
          messageContent.toLowerCase().includes(keyword.toLowerCase())
        );
      } else if (trigger.type === "WELCOME") {
        // Execute on first message
        const messageCount = await prisma.message.count({
          where: { conversationId },
        });
        shouldExecute = messageCount === 1;
      } else if (trigger.type === "TIME_BASED") {
        // Check business hours
        const now = new Date();
        const hour = now.getHours();
        shouldExecute = hour >= conditions.startHour && hour < conditions.endHour;
      }

      if (shouldExecute) {
        // Execute actions
        if (actions.sendMessage) {
          await prisma.message.create({
            data: {
              conversationId,
              content: actions.message,
              sender: "BOT",
            },
          });
        }

        if (actions.assignTo) {
          await prisma.chatAssignment.create({
            data: {
              conversationId,
              userId: actions.assignTo,
            },
          });
        }

        if (actions.updateStatus) {
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { status: actions.status },
          });
        }
      }
    }
  } catch (error) {
    console.error("Execute triggers error:", error);
  }
}
