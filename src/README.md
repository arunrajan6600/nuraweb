# Next.js Personal Website with Blog Posts and Admin Panel

This project is a Next.js-based personal website that renders blog-like "posts" with an admin panel for editing in development mode.

## Features

- Posts with different cell types (markdown, image, video, component)
- Admin panel for editing posts (development mode only)
- Responsive design using shadcn/ui components
- Static site generation for production

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Create a `posts.json` file in the root directory (a sample is provided)

### Development Mode (with Admin Panel)

To run the project in development mode with the admin panel enabled:

\`\`\`bash
NEXT_PUBLIC_ADMIN_ENABLED=true npm run dev
\`\`\`

This will start the development server with the admin panel enabled, allowing you to create, edit, and delete posts.

### Production Mode (without Admin Panel)

To build and run the project in production mode:

\`\`\`bash
npm run build
npm start
\`\`\`

In production mode, the admin panel is not available, and the site only renders the static content from `posts.json`.

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `components/` - React components
  - `admin/` - Admin panel components (only used in development)
  - `cells/` - Cell type components for rendering different content types
- `lib/` - Utility functions
- `types/` - TypeScript type definitions
- `posts.json` - Data store for posts

## Environment Variables

- `NEXT_PUBLIC_ADMIN_ENABLED` - Set to "true" to enable the admin panel in development mode

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- shadcn/ui components
- Tailwind CSS
- react-markdown
