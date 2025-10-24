import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return session.user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}

export async function requireTenant() {
  const user = await requireAuth();
  if (!user.tenantId) {
    redirect("/onboarding");
  }
  return user;
}

export function isSuperAdmin(role: string) {
  return role === "SUPERADMIN" || role === "SUPERADMIN_SUPPORT";
}

export function isTenantAdmin(role: string) {
  return role === "TENANT_ADMIN";
}

export function canManageTenant(role: string) {
  return isSuperAdmin(role) || isTenantAdmin(role);
}
