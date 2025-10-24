"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Code } from "lucide-react";

export default function WidgetDemoPage() {
  const [embedCode, setEmbedCode] = useState("");
  const [showWidget, setShowWidget] = useState(false);

  const handleTest = () => {
    if (embedCode) {
      setShowWidget(true);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Widget Demo</h1>
          <p className="text-muted-foreground">
            Test your chat widget before embedding it on your website
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Your Widget</CardTitle>
            <CardDescription>
              Enter your chatbot's embed code to preview the widget
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="embedCode">Embed Code</Label>
              <div className="flex gap-2">
                <Input
                  id="embedCode"
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  placeholder="tchat-xxxxxxxxxxxx"
                />
                <Button onClick={handleTest}>
                  <Code className="mr-2 h-4 w-4" />
                  Test Widget
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                You can find your embed code in the chatbot settings
              </p>
            </div>

            {showWidget && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Widget Preview:</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Look at the bottom right corner of your screen to see the chat widget
                </p>
                <iframe
                  src={`/widget?embed=${embedCode}`}
                  className="w-full h-[600px] border rounded-lg"
                  title="Chat Widget Preview"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Embed</CardTitle>
            <CardDescription>
              Add this code to your website to display the chat widget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Step 1: Copy the embed code</p>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${typeof window !== "undefined" ? window.location.origin : ""}/widget?embed=YOUR_EMBED_CODE';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.pointerEvents = 'none';
    iframe.onload = function() {
      iframe.contentWindow.document.body.style.pointerEvents = 'auto';
    };
    document.body.appendChild(iframe);
  })();
</script>`}
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Step 2: Replace YOUR_EMBED_CODE</p>
                <p className="text-xs text-muted-foreground">
                  Replace <code className="bg-muted px-1 py-0.5 rounded">YOUR_EMBED_CODE</code> with your actual embed code (e.g., tchat-abc123xyz)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Step 3: Add to your website</p>
                <p className="text-xs text-muted-foreground">
                  Paste the code before the closing <code className="bg-muted px-1 py-0.5 rounded">&lt;/body&gt;</code> tag on every page where you want the widget to appear
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
