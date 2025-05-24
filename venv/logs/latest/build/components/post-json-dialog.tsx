"use client"

import { useState } from "react"
import { Check, Copy, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Post } from "@/lib/data"

interface PostJsonDialogProps {
  post: Post
}

export default function PostJsonDialog({ post }: PostJsonDialogProps) {
  const [copied, setCopied] = useState(false)

  // Create a clean version of the post for JSON display
  const postForJson = {
    ...post,
    // Remove the id field as it will be regenerated when added to database.json
    id: undefined,
  }

  const jsonString = JSON.stringify(postForJson, null, 2)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Code className="h-4 w-4" />
          Copy as JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Post JSON</DialogTitle>
          <DialogDescription>
            Copy this JSON and add it to your database.json file to include this post in your site.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto max-h-[60vh] text-sm">
            <code>{jsonString}</code>
          </pre>
          <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={copyToClipboard}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </>
            )}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>To add this post to your site:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Copy the JSON above</li>
            <li>Open your database.json file</li>
            <li>Add this object to the posts array</li>
            <li>Generate static content using the admin dashboard</li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  )
}
