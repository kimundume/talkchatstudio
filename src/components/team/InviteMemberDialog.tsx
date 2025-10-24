"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { inviteTeamMember } from "@/app/actions/team";
import { useRouter } from "next/navigation";

export function InviteMemberDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"TENANT_ADMIN" | "TENANT_USER">("TENANT_USER");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setTempPassword("");

    const result = await inviteTeamMember({
      name,
      email,
      role,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setTempPassword(result.tempPassword || "");
      setName("");
      setEmail("");
      setRole("TENANT_USER");
      setIsLoading(false);
      router.refresh();
      
      // Show success message for a moment before closing
      setTimeout(() => {
        setOpen(false);
        setTempPassword("");
      }, 5000);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your team. They'll receive login credentials.
          </DialogDescription>
        </DialogHeader>

        {tempPassword ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✓ Team member invited successfully!
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                Share these credentials with {name}:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded p-3 space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Email:</span>
                  <p className="font-mono text-sm">{email}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Temporary Password:</span>
                  <p className="font-mono text-sm font-bold">{tempPassword}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ⚠️ Save this password now. It won't be shown again.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as "TENANT_ADMIN" | "TENANT_USER")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={isLoading}
              >
                <option value="TENANT_USER">Agent - Can handle conversations</option>
                <option value="TENANT_ADMIN">Admin - Full access to settings</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Inviting..." : "Send Invitation"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
