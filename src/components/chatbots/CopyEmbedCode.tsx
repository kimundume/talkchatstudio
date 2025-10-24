"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyEmbedCode({ embedCode }: { embedCode: string }) {
  const [copied, setCopied] = useState(false);

  const code = `<script src="https://cdn.talkchat.studio/widget.js" data-chatbot="${embedCode}"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-2 right-2"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </>
          )}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Paste this code snippet before the closing <code className="bg-muted px-1 py-0.5 rounded">&lt;/body&gt;</code> tag on every page where you want the chat widget to appear.
      </p>
    </div>
  );
}
