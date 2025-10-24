import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatbotId, visitorName, visitorEmail, visitorId } = body;

    if (!chatbotId) {
      return NextResponse.json(
        { error: "Chatbot ID is required" },
        { status: 400 }
      );
    }

    // Get chatbot to verify it exists and get tenantId
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      select: { tenantId: true, isActive: true },
    });

    if (!chatbot || !chatbot.isActive) {
      return NextResponse.json(
        { error: "Chatbot not found or inactive" },
        { status: 404 }
      );
    }

    // Check if conversation already exists for this visitor
    let conversation = await prisma.conversation.findFirst({
      where: {
        chatbotId,
        visitorId,
        status: { in: ["OPEN", "ASSIGNED"] },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // Create new conversation if none exists
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          tenantId: chatbot.tenantId,
          chatbotId,
          visitorId,
          visitorName,
          visitorEmail,
          status: "OPEN",
        },
        include: {
          messages: true,
        },
      });

      // Send initial greeting message
      const settings = await prisma.chatbot.findUnique({
        where: { id: chatbotId },
        select: { settings: true },
      });

      const greeting = (settings?.settings as any)?.greeting || "Hi! How can we help you today?";

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: greeting,
          sender: "BOT",
        },
      });

      // Fetch conversation again with greeting message
      conversation = await prisma.conversation.findUnique({
        where: { id: conversation.id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      }) as any;
    }

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        messages: conversation.messages,
      },
    });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
