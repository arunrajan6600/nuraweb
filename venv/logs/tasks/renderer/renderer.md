# Goal:

Design and build a personal portfolio website using Next.js, with a rich cell-based blog system.

# Tech stack:

- Framework: Next.js (App Router)
- Styling:
  - Tailwind CSS
  - Shadcn UI components
  - Typography: Tailwind Typography for blog content
- Content:
  - Cell-based blog system with React Markdown
  - Supported cells: Text, Image, Quote, Code, Video
  - Rich text editing with markdown support
  - Drag and drop cell reordering
- Animation: Framer Motion
- 3D: Three.js with GLSL shaders
- Forms: React Hook Form
- Auth: NextAuth.js
- Database: Prisma with SQLite
- Deployment: Vercel

# Blog System Features:

## Cell Types

1. Text Cell

   - Rich text editing with Markdown support
   - Full typography styling
   - Support for headings, lists, links

2. Image Cell

   - Image URL support
   - Alt text for accessibility
   - Optional captions
   - Responsive image loading

3. Quote Cell

   - Quote text
   - Optional author attribution
   - Stylized blockquote design

4. Code Cell

   - Syntax highlighting with Prism
   - Multiple language support
   - Copy code functionality
   - Dark/light theme support

5. Video Cell
   - YouTube/Vimeo embedding
   - Responsive video container
   - Optional captions
   - Auto-conversion of video URLs

## Editor Features

- Drag and drop cell reordering
- Preview mode
- Cell type selection
- Individual cell editing
- Cell deletion
- Slug generation and validation
- Featured image support
- Draft/Published state management

# Page structure and components:

- Home Page:

  - Navigation bar:
    - Left: Rounded user badge, name
    - Center: Links [Home, About, Projects, Blog]
    - Right:
      - If logged in: [Logout, Profile]
      - If not logged in: Repeat center links
  - Hero section:
    - Fullscreen canvas background with three.js + GLSL
    - Title: "Arun Nura"
    - Subtitle: "Multi-disciplinary developer"
    - Call-to-action button

- Blog Section (on Home):

  - Title: "Latest Blog Posts"
  - Horizontal carousel with blog cards:
    - Blog title, preview media, description, date, "Read more"
  - "View All Blog Posts" button → Blog Page

- Projects Section (on Home):

  - Title: "Latest Projects"
  - Horizontal carousel with project cards:
    - Project title, preview media, description, date, "View project"
  - "View All Projects" button → Projects Page

- Footer:

  - Navigation links: [Home, About, Projects, Blog]
  - Social links: [GitHub, LinkedIn, Twitter]
  - Contact info: Email
  - Contact form: Name, Email, Message, Submit

- About Page:

  - Title: "About Me"
  - Personal description
  - Skills section:
    - Cards showing skill name + level (e.g., beginner, expert)
  - Experience section:
    - Job title, company, description, duration
  - Education section:
    - Degree, institution, duration

- Projects Page:

  - Title: "My Projects"
  - Filter/sort options: [Category, Technology, Date]
  - Project cards:
    - Title, preview media, description, date, view button
  - Individual Project Page:
    - Title, content, date, live demo link, source code link

- Blog Page:
  - Title: "My Blog"
  - Filter/sort options: [Category, Date]
  - Blog post cards:
    - Title, preview media, description, date, "Read more"
  - Individual Blog Post Page:
    - Title, author, date, full content

# Admin Features:

- Cell-based post editor with live preview
- Post management dashboard
- Create, edit, publish, unpublish posts
- Delete posts
- View all posts with status
- Drag and drop cell reordering
- Media management for images

# Blog Frontend:

- Featured posts on homepage
- Blog listing page with published posts
- Individual post pages with cell-based rendering
- SEO-friendly URLs
- Responsive design
- Dark mode support

# Component Architecture:

## Blog Components

- CellRenderer: Main component for rendering blog cells
- Individual cell components:
  - TextCell: Renders markdown content
  - ImageCell: Handles responsive images
  - QuoteCell: Styled blockquotes
  - CodeCell: Syntax highlighted code
  - VideoCell: Embedded video player

## Admin Components

- PostEditor: Main editing interface
- CellEditor: Individual cell editing
- Cell type selection interface
- Preview mode component

# Database Schema:

```prisma
model BlogPost {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  cells     Json     // Stored as structured JSON
  imageUrl  String?
  published Boolean  @default(false)
  authorId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

# Constraints:

- Reusable, modular components
- Mobile responsive
- Animations for transitions
- Lazy load media where applicable
- SEO-optimized

# Implementation Steps:

1. Cell System Setup

   - Implement cell type interfaces
   - Create cell renderer components
   - Set up cell editor components
   - Implement drag and drop functionality

2. Admin Interface

   - Build post editor with cell support
   - Implement preview mode
   - Add post management features
   - Set up media handling

3. Frontend Development

   - Create blog list and detail pages
   - Implement cell rendering
   - Add responsive design
   - Set up dark mode

4. Authentication & Authorization

   - Configure NextAuth.js
   - Set up user roles
   - Implement protected routes

5. Database & API
   - Set up Prisma schema
   - Create API routes
   - Implement CRUD operations
   - Add post validation
