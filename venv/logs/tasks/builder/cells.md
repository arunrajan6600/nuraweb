# Blog Post Cell Configuration Guide

Each blog post is composed of multiple content cells that can be arranged in any order. This document describes how to configure these cells with examples.

## Cell Types

### 1. Text Cell

Supports Markdown formatting for rich text content.

```json
{
  "id": "text-123",
  "type": "text",
  "content": {
    "text": "# Main Heading\n\nThis is a paragraph with **bold** and *italic* text.\n\n- List item 1\n- List item 2"
  }
}
```

### 2. Image Cell

Displays images with optional caption and alt text.

```json
{
  "id": "image-456",
  "type": "image",
  "content": {
    "url": "https://example.com/image.jpg",
    "alt": "A descriptive alt text for accessibility",
    "caption": "Optional caption text below the image"
  }
}
```

### 3. Quote Cell

Displays blockquotes with optional attribution.

```json
{
  "id": "quote-789",
  "type": "quote",
  "content": {
    "text": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs"
  }
}
```

### 4. Code Cell

Displays syntax-highlighted code blocks.

```json
{
  "id": "code-012",
  "type": "code",
  "content": {
    "code": "function hello() {\n  console.log('Hello, world!');\n}",
    "language": "javascript"
  }
}
```

Supported languages:

- JavaScript
- TypeScript
- HTML
- CSS
- JSX
- TSX
- JSON
- Python
- Ruby
- Go
- Rust
- Java
- C#
- PHP
- Bash
- SQL

### 5. Video Cell

Embeds videos from YouTube or Vimeo.

```json
{
  "id": "video-345",
  "type": "video",
  "content": {
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "caption": "Optional video caption"
  }
}
```

## Complete Blog Post Example

Here's an example of a complete blog post structure:

```json
{
  "id": "post-123",
  "title": "Getting Started with Web Development",
  "slug": "getting-started-with-web-development",
  "published": true,
  "imageUrl": "https://example.com/featured-image.jpg",
  "cells": [
    {
      "id": "text-1",
      "type": "text",
      "content": {
        "text": "# Getting Started with Web Development\n\nIn this guide, we'll explore the basics of web development."
      }
    },
    {
      "id": "image-1",
      "type": "image",
      "content": {
        "url": "https://example.com/web-dev-tools.jpg",
        "alt": "Common web development tools",
        "caption": "Essential tools for web development"
      }
    },
    {
      "id": "code-1",
      "type": "code",
      "content": {
        "code": "<!DOCTYPE html>\n<html>\n<head>\n  <title>My First Webpage</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>",
        "language": "html"
      }
    },
    {
      "id": "quote-1",
      "type": "quote",
      "content": {
        "text": "The web is not a fixed width",
        "author": "Ethan Marcotte"
      }
    },
    {
      "id": "video-1",
      "type": "video",
      "content": {
        "url": "https://www.youtube.com/watch?v=example",
        "caption": "Introduction to HTML and CSS"
      }
    }
  ],
  "createdAt": "2025-05-09T10:00:00Z",
  "updatedAt": "2025-05-09T10:00:00Z",
  "authorId": "user-123"
}
```

## Features

1. **Drag and Drop**: Cells can be reordered using drag and drop
2. **Live Preview**: Changes are previewed in real-time
3. **Markdown Support**: Text cells support full Markdown syntax
4. **Responsive Media**: Images and videos are responsive by default
5. **Syntax Highlighting**: Code blocks include syntax highlighting
6. **Flexible Content**: Mix and match different cell types
7. **Video Embedding**: Automatic conversion of YouTube/Vimeo URLs to embeds

## Best Practices

1. Use meaningful alt text for images
2. Keep code snippets focused and well-commented
3. Break up long content into multiple text cells
4. Use quotes to highlight important points
5. Include captions for media when relevant
6. Organize content in a logical flow
7. Preview content before publishing
