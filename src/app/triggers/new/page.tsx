"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTrigger } from "@/app/actions/trigger";
import { getChatbots } from "@/app/actions/chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function NewTriggerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatbots, setChatbots] = useState<any[]>([]);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chatbotId, setChatbotId] = useState("");
  const [type, setType] = useState("KEYWORD");
  const [keywords, setKeywords] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    getChatbots().then((result) => {
      if (result.success) {
        setChatbots(result.chatbots || []);
        if (result.chatbots && result.chatbots.length > 0) {
          setChatbotId(result.chatbots[0].id);
        }
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const conditions: any = {};
    const actions: any = {
      sendMessage: true,
      message: responseMessage,
    };

    if (type === "KEYWORD") {
      conditions.keywords = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    } else if (type === "TIME_BASED") {
      conditions.startHour = 9;
      conditions.endHour = 17;
    }

    const result = await createTrigger({
      name,
      description,
      chatbotId,
      type,
      conditions,
      actions,
      isActive,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/triggers");
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/triggers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Trigger</h2>
          <p className="text-muted-foreground">
            Automate responses and actions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Give your trigger a name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Trigger Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Pricing Question Auto-Response"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this trigger do?"
                disabled={isLoading}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chatbot">Chatbot *</Label>
              <select
                id="chatbot"
                value={chatbotId}
                onChange={(e) => setChatbotId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
                disabled={isLoading}
              >
                {chatbots.map((chatbot) => (
                  <option key={chatbot.id} value={chatbot.id}>
                    {chatbot.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trigger Type</CardTitle>
            <CardDescription>
              When should this trigger activate?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={isLoading}
              >
                <option value="KEYWORD">Keyword Match</option>
                <option value="WELCOME">Welcome Message</option>
                <option value="TIME_BASED">Business Hours</option>
              </select>
            </div>

            {type === "KEYWORD" && (
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma-separated) *</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="pricing, cost, price, how much"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Trigger will activate when visitor message contains any of these keywords
                </p>
              </div>
            )}

            {type === "WELCOME" && (
              <p className="text-sm text-muted-foreground">
                This trigger will activate when a visitor starts a new conversation
              </p>
            )}

            {type === "TIME_BASED" && (
              <p className="text-sm text-muted-foreground">
                This trigger will only activate during business hours (9 AM - 5 PM)
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action</CardTitle>
            <CardDescription>
              What should happen when this trigger activates?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="response">Auto-Response Message *</Label>
              <Textarea
                id="response"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Enter the message to send automatically..."
                required
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
                disabled={isLoading}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Activate trigger immediately
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading || !chatbotId} className="flex-1">
            <Zap className="mr-2 h-4 w-4" />
            {isLoading ? "Creating..." : "Create Trigger"}
          </Button>
          <Link href="/triggers">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
