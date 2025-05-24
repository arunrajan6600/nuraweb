### Next.js Personal Website with Blog Posts and Admin Panel

## Context

You are a frontend LLM engineer.
Implement a Next.js-based personal website that renders blog-like "posts".
Each post is an **ordered collection of cells**.
Each cell can be one of:

- markdown (rendered as rich content)
- image (with URL and alt)
- video (with URL)
- component (predefined React component with props)

## Requirements

1. **Posts Model**

1. Use a JSON file (`posts.json`) to store all posts.
1. Each post has: id, title, cells[]
1. Each cell has: id, type, content (varies by type)

1. **Development Mode**

1. When running locally (development), the UI exposes a robust admin panel:

1. Easy and intuitive UI/UX using shadcn/ui components.
1. List all posts and allow selecting any post for editing.
1. Allow the following for posts:

1. Create new post, edit title, delete post.

1. For each post, show its ordered list of cells.
1. For cells:

1. Add new cell (choose type using shadcn/ui Dialog).
1. Edit cell content (with appropriate input for each type, e.g. markdown editor, image URL, video URL, component/props).
1. Reorder cells via drag-and-drop using shadcn/ui sortable components.
1. Delete cell.

1. All changes are live-editable and reflected immediately in the UI.
1. Save edits by updating `posts.json` via Next.js API routes.
1. Live reload or refresh when posts are updated.

1. **Production/Build Mode**

1. When built for production, admin features are omitted.
1. Only the static `posts.json` is consumed.
1. No editing UI or write API is present in the build.

1. **Tech Stack**

1. Next.js (App Router)
1. shadcn/ui for all UI components
1. Use `react-markdown` for rendering markdown cells.
1. Use Next.js API routes for local development to enable editing `posts.json`.

## Implementation Steps

- Scaffold the Next.js project with shadcn/ui components.
- Implement conditional admin UI based on environment variables (e.g., `NEXT_PUBLIC_ADMIN_ENABLED`).
- Create cell components for each type using shadcn/ui styling.
- Implement a robust admin panel using shadcn/ui components:

- Use Dialog for editing cells
- Use Tabs for organizing the admin interface
- Use Form components for editing content
- Use Button, Card, and other UI elements
- Use Command (command palette) for quick actions

- In dev, use Next.js API routes to update `posts.json`.
- In prod, only render posts (no edit features).
- Include a sample `posts.json` and use Tailwind CSS for styling.

## Deliverables

1. Next.js project scaffold and folder structure.
2. `posts.json` sample.
3. Next.js API routes for editing posts (dev only).
4. React code for:

5. Loading and rendering posts/cells.
6. **Robust Admin UI using shadcn/ui components for editing (dev only, hidden in build), as described above.**
7. Environment-based feature gating.

8. README with how to run in dev and build modes.

## Constraints

- No backend for production — just static files.
- All editing is local file-based in dev.
- The code should be modular and clear.
- Use shadcn/ui components for all UI elements.

## Output

- All relevant project files in code blocks, using GitHub Copilot file format.
- README with clear instructions.

## Goal

A competent frontend LLM engineer should be able to implement this full-stack local editing workflow for posts, with strict separation between dev (admin enabled) and build (static, no admin features) modes.
The admin panel must be robust, seamless, and intuitive for editing any post and its cells, built entirely with Next.js and shadcn/ui components.
