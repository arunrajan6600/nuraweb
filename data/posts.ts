// Auto-generated posts file
// Version: v20250809-174801
// Generated: 2025-08-09T17:48:13.510Z
// Source: API (http://localhost:3001/dev/posts)

import { Post } from "@/types/post";

export const posts: Post[] = [
  {
    "id": "ME44B9PSEQO7OQQO6",
    "title": "test",
    "slug": "test",
    "status": "published",
    "featured": true,
    "type": "project",
    "excerpt": "test",
    "createdAt": "2025-08-09T10:34:31.792Z",
    "updatedAt": "2025-08-09T10:39:24.035Z",
    "viewCount": 3,
    "cells": [
      {
        "id": "ME44HJGI4PY7SQ8IYTE",
        "type": "markdown",
        "content": "\"test me\\n:::success\\nThis is a success callout box.\\n:::\"",
        "order": 1
      },
      {
        "id": "ME44HJICCB0PE44WQK",
        "type": "markdown",
        "content": "\"then test again\\n:::warning\\nThis is a warning callout \\n:::success\\nThis is a success callout box.\\n:::\\n:::success\\nThis is a success callout box.\\n:::\\n- Item 1\\n- Item 2\\n- Item 3\\n# Heading 1\\nbox.\\n:::\"",
        "order": 2
      }
    ]
  }
];

export const postsMetadata = {
  version: "v20250809-174801",
  generatedAt: "2025-08-09T17:48:13.510Z",
  source: "api",
  count: 1
};
