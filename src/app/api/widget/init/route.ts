import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const embedCode = request.nextUrl.searchParams.get("embedCode");

    if (!embedCode) {
      return NextResponse.json(
        { error: "Embed code is required" },
        { status: 400 }
      );
    }

    // Find chatbot by embed code
    const chatbot = await prisma.chatbot.findUnique({
      where: { embedCode },
      select: {
        id: true,
        name: true,
        settings: true,
        isActive: true,
      },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: "Chatbot not found" },
        { status: 404 }
      );
    }

    if (!chatbot.isActive) {
      return NextResponse.json(
        { error: "Chatbot is not active" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      chatbot: {
        id: chatbot.id,
        name: chatbot.name,
        settings: chatbot.settings,
      },
    });
  } catch (error) {
    console.error("Widget init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize widget" },
      { status: 500 }
    );
  }
}
