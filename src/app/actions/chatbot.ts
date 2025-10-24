"use server";

import { prisma } from "@/lib/db/prisma";
import { requireTenant } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function createChatbot(data: {
  name: string;
  description?: string;
  settings: {
    primaryColor: string;
    secondaryColor: string;
    position: "bottom-right" | "bottom-left";
    greeting: string;
    placeholder: string;
    showBranding: boolean;
  };
}) {
  try {
    const user = await requireTenant();

    // Generate unique embed code
    const embedCode = `tchat-${nanoid(12)}`;

    const chatbot = await prisma.chatbot.create({
      data: {
        name: data.name,
        description: data.description,
        tenantId: user.tenantId!,
        embedCode,
        settings: data.settings,
        isActive: true,
      },
    });

    revalidatePath("/chatbots");
    return { success: true, chatbot };
  } catch (error) {
    console.error("Create chatbot error:", error);
    return { error: "Failed to create chatbot" };
  }
}

export async function updateChatbot(
  id: string,
  data: {
    name?: string;
    description?: string;
    settings?: any;
    isActive?: boolean;
  }
) {
  try {
    const user = await requireTenant();

    // Verify chatbot belongs to user's tenant
    const existingChatbot = await prisma.chatbot.findFirst({
      where: {
        id,
        tenantId: user.tenantId!,
      },
    });

    if (!existingChatbot) {
      return { error: "Chatbot not found" };
    }

    const chatbot = await prisma.chatbot.update({
      where: { id },
      data,
    });

    revalidatePath("/chatbots");
    revalidatePath(`/chatbots/${id}`);
    return { success: true, chatbot };
  } catch (error) {
    console.error("Update chatbot error:", error);
    return { error: "Failed to update chatbot" };
  }
}

export async function deleteChatbot(id: string) {
  try {
    const user = await requireTenant();

    // Verify chatbot belongs to user's tenant
    const existingChatbot = await prisma.chatbot.findFirst({
      where: {
        id,
        tenantId: user.tenantId!,
      },
    });

    if (!existingChatbot) {
      return { error: "Chatbot not found" };
    }

    await prisma.chatbot.delete({
      where: { id },
    });

    revalidatePath("/chatbots");
    return { success: true };
  } catch (error) {
    console.error("Delete chatbot error:", error);
    return { error: "Failed to delete chatbot" };
  }
}

export async function toggleChatbotStatus(id: string) {
  try {
    const user = await requireTenant();

    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id,
        tenantId: user.tenantId!,
      },
    });

    if (!chatbot) {
      return { error: "Chatbot not found" };
    }

    const updated = await prisma.chatbot.update({
      where: { id },
      data: {
        isActive: !chatbot.isActive,
      },
    });

    revalidatePath("/chatbots");
    return { success: true, isActive: updated.isActive };
  } catch (error) {
    console.error("Toggle chatbot status error:", error);
    return { error: "Failed to toggle chatbot status" };
  }
}

export async function getChatbots() {
  try {
    const user = await requireTenant();

    const chatbots = await prisma.chatbot.findMany({
      where: {
        tenantId: user.tenantId!,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            conversations: true,
          },
        },
      },
    });

    return { success: true, chatbots };
  } catch (error) {
    console.error("Get chatbots error:", error);
    return { error: "Failed to fetch chatbots" };
  }
}

export async function getChatbot(id: string) {
  try {
    const user = await requireTenant();

    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id,
        tenantId: user.tenantId!,
      },
      include: {
        _count: {
          select: {
            conversations: true,
            triggers: true,
          },
        },
      },
    });

    if (!chatbot) {
      return { error: "Chatbot not found" };
    }

    return { success: true, chatbot };
  } catch (error) {
    console.error("Get chatbot error:", error);
    return { error: "Failed to fetch chatbot" };
  }
}
