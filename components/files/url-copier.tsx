'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';

interface URLCopierProps {
  url: string;
}

export function URLCopier({ url }: URLCopierProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={url}
        readOnly
        className="text-xs font-mono bg-muted/50"
        onClick={(e) => e.currentTarget.select()}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="px-2"
        disabled={copied}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
