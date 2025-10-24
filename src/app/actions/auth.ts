"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { signIn } from "@/lib/auth/auth";
import { AuthError } from "next-auth";

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  companyName?: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await hash(formData.password, 12);

    // Create tenant if company name provided
    let tenantId: string | null = null;
    if (formData.companyName) {
      const slug = formData.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const tenant = await prisma.tenant.create({
        data: {
          name: formData.companyName,
          slug: `${slug}-${Date.now()}`,
          email: formData.email,
          plan: "STARTER",
          status: "TRIAL",
        },
      });
      tenantId = tenant.id;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        role: tenantId ? "TENANT_ADMIN" : "TENANT_USER",
        tenantId,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to create account. Please try again." };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function createTenant(data: {
  name: string;
  email: string;
  userId: string;
}) {
  try {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        slug: `${slug}-${Date.now()}`,
        email: data.email,
        plan: "STARTER",
        status: "TRIAL",
      },
    });

    // Update user to be tenant admin
    await prisma.user.update({
      where: { id: data.userId },
      data: {
        tenantId: tenant.id,
        role: "TENANT_ADMIN",
      },
    });

    return { success: true, tenantId: tenant.id };
  } catch (error) {
    console.error("Tenant creation error:", error);
    return { error: "Failed to create organization" };
  }
}
