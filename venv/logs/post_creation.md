### Implement Blog Publishing Functionality

````sudolang
You are the backend engineer responsible for implementing the full blog publishing flow for a modular blog platform.

🎯 Goal:
Allow an admin to create, update, preview, and publish a blog post composed of modular "cells" (text, image, code, etc.). Viewers can only see blogs that are marked as `published = true`.

🧱 Stack:
- Node.js + TypeScript
- Prisma ORM
- SQLite (dev) or PostgreSQL (prod)
- Next.js API routes
- NextAuth.js (admin-only auth)
- zod (for input validation)

🧩 BlogPost Model:
```prisma
model BlogPost {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  published Boolean  @default(false)
  imageUrl  String?
  cells     Json     // Array of typed cells
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
````

🧠 Step-by-step Functionalities to Implement:

1. **Create Blog Draft**
   `POST /api/admin/posts`

   - Accepts: `title`, optional `imageUrl`, empty `cells` array or initial content
   - Generates a unique `slug` from the title
   - Response: newly created `BlogPost` with `published: false`

2. **Update Blog Content**
   `PUT /api/admin/posts/:id`

   - Accepts: full post payload including `cells: BlogCell[]`
   - Use zod to validate each cell:

     ```ts
     type BlogCell = {
       id: string;
       type: "text" | "image" | "code" | "quote" | "video";
       content: any;
     };
     ```

   - Persist the update
   - Only editable if `published == false`

3. **Preview Blog (Draft Mode)**
   `GET /api/admin/posts/:id/preview`

   - Returns post content regardless of `published` flag
   - Admin-only access

4. **Publish Blog**
   `POST /api/admin/posts/:id/publish`

   - Validates that the blog has:

     - At least 1 cell
     - A title
     - A unique slug

   - Sets `published = true`
   - Updates `updatedAt` timestamp

5. **Unpublish Blog (Optional)**
   `POST /api/admin/posts/:id/unpublish`

   - Sets `published = false`

6. **Public Fetch for Viewers**
   `GET /api/posts/:slug`

   - Returns the post **only if `published == true`**
   - 404 if not found or unpublished

🔐 Auth:

- All `admin/*` routes require an authenticated admin via NextAuth
- Viewer routes are public and read-only

🛠️ Notes:

- Use slugify for unique slugs
- Use middleware to enforce admin access
- Use zod to validate all inputs
- Write tests or mocks for each route

✅ Deliverables:

- API route handlers
- Auth middleware
- Input validators
- Slug generation utility
- Optional preview mode support for live draft previewing

The result should be a robust, secure, and extensible blog publishing pipeline.
