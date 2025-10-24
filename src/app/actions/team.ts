"use server";

import { prisma } from "@/lib/db/prisma";
import { requireTenant, requireRole } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

export async function getTeamMembers() {
  try {
    const user = await requireTenant();

    const members = await prisma.user.findMany({
      where: {
        tenantId: user.tenantId!,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            assignedChats: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, members };
  } catch (error) {
    console.error("Get team members error:", error);
    return { error: "Failed to fetch team members" };
  }
}

export async function inviteTeamMember(data: {
  email: string;
  name: string;
  role: "TENANT_ADMIN" | "TENANT_USER";
}) {
  try {
    const user = await requireRole(["TENANT_ADMIN", "SUPERADMIN"]);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Create temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await hash(tempPassword, 12);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role,
        tenantId: user.tenantId!,
      },
    });

    // TODO: Send invitation email with temporary password

    revalidatePath("/team");
    return { 
      success: true, 
      user: newUser,
      tempPassword, // In production, don't return this - send via email
    };
  } catch (error) {
    console.error("Invite team member error:", error);
    return { error: "Failed to invite team member" };
  }
}

export async function updateTeamMember(
  userId: string,
  data: {
    name?: string;
    role?: "TENANT_ADMIN" | "TENANT_USER";
  }
) {
  try {
    const user = await requireRole(["TENANT_ADMIN", "SUPERADMIN"]);

    // Verify member belongs to same tenant
    const member = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: user.tenantId!,
      },
    });

    if (!member) {
      return { error: "Team member not found" };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });

    revalidatePath("/team");
    return { success: true, user: updated };
  } catch (error) {
    console.error("Update team member error:", error);
    return { error: "Failed to update team member" };
  }
}

export async function removeTeamMember(userId: string) {
  try {
    const user = await requireRole(["TENANT_ADMIN", "SUPERADMIN"]);

    // Verify member belongs to same tenant
    const member = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: user.tenantId!,
      },
    });

    if (!member) {
      return { error: "Team member not found" };
    }

    // Don't allow removing yourself
    if (member.id === user.id) {
      return { error: "You cannot remove yourself" };
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    console.error("Remove team member error:", error);
    return { error: "Failed to remove team member" };
  }
}

export async function getTeamStats() {
  try {
    const user = await requireTenant();

    const [totalMembers, activeConversations, resolvedToday] = await Promise.all([
      prisma.user.count({
        where: { tenantId: user.tenantId! },
      }),
      prisma.conversation.count({
        where: {
          tenantId: user.tenantId!,
          status: { in: ["OPEN", "ASSIGNED"] },
        },
      }),
      prisma.conversation.count({
        where: {
          tenantId: user.tenantId!,
          status: "RESOLVED",
          updatedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return {
      success: true,
      stats: {
        totalMembers,
        activeConversations,
        resolvedToday,
      },
    };
  } catch (error) {
    console.error("Get team stats error:", error);
    return { error: "Failed to fetch team stats" };
  }
}
