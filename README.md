# NuraWeb Portfolio

A modern, content-driven portfolio and blog site built with Next.js 13+, TypeScript, Tailwind CSS, and Shadcn UI. Features a cell-based content system, visual editor, and automated GitHub Pages deployment.

## 📚 Documentation

Please visit our [Documentation](./docs/README.md) for:

- 🚀 [Getting Started Guide](./docs/getting-started/QUICK_START.md)
- 📁 [File Upload System](./docs/features/FILE_SYSTEM.md)

## Quick Start

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd nuraweb
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

For detailed setup instructions and documentation, please visit our [Getting Started Guide](./docs/getting-started/QUICK_START.md).

Your site will be available at [http://localhost:3000](http://localhost:3000)

## Content Management

### Managing Posts

Posts are stored in `data/posts.ts`. Each post has:

- `id`: Unique identifier
- `type`: Either "blog" or "project"
- `title`: Post title
- `status`: "draft" or "published"
- `featured`: Boolean to show on home page
- `thumbnail`: Optional image URL
- `cells`: Array of content cells
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Using the Visual Editor

1. Navigate to `/edit/[id]` (e.g., `/edit/1`)
2. Use the visual editor to:
   - Add/edit markdown content
   - Add images via URL
   - Rearrange cells using drag-and-drop
   - Preview content in real-time
3. Copy the generated JSON
4. Update `data/posts.ts` with the new content

### Content Update SOP

1. **Create/Edit Content:**

   - Use the visual editor for content creation
   - Save the JSON output
   - Update `data/posts.ts`
   - Test in development

2. **Review Changes:**

   - Check all pages: home, blog, projects
   - Verify responsive layouts
   - Test dark/light themes

3. **Deploy Changes:**
   - Commit changes to main branch
   - Push to GitHub
   - GitHub Actions will automatically deploy

## Deployment

The site uses GitHub Actions for automated deployment to GitHub Pages.

### First-Time Setup

1. In your GitHub repository:

   - Go to Settings > Pages
   - Set Source to "GitHub Actions"

2. Update environment variables:
   - Set `NEXT_PUBLIC_BASE_PATH` in `.env`:
     - For username.github.io: leave empty
     - For other repos: set to "/repository-name"

### Deployment Process

1. **Automatic Deployment:**

   - Push to main branch
   - GitHub Actions will:
     - Build the site
     - Deploy to GitHub Pages
     - Provide the URL in action output

2. **Manual Deployment:**
   ```bash
   npm run build
   ```
   - Check `out` directory for built files

### Checking Deployment

1. Wait for GitHub Actions to complete
2. Access your site at:
   - `https://username.github.io` (for username.github.io)
   - `https://username.github.io/repository-name` (for other repos)

## Environment Variables

```env
# Theme (light/dark)
NEXT_PUBLIC_DEFAULT_THEME="light"

# Base path for GitHub Pages
NEXT_PUBLIC_BASE_PATH="/repository-name"
```

## Development Notes

- Site uses environment-controlled theming
- All images must use remote URLs (e.g., Unsplash)
- Content is statically generated
- Base path is required for correct asset loading

## 🚀 Deployment

### Production Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch.

#### Serverless API Functions

The backend API functions are deployed to AWS Lambda:

**Production API Base URL:** `https://lynzm5kprh.execute-api.ap-south-1.amazonaws.com/prod`

**Available Endpoints:**
- `POST /auth/login` - Admin authentication
- `GET /auth/verify` - JWT token verification
- `GET /files` - List uploaded files
- `POST /files/upload` - Upload new files
- `DELETE /files/{id}` - Delete files

#### Frontend Deployment

1. **Automatic Deployment (Recommended):**
   - Push to `main` branch
   - GitHub Actions will automatically build and deploy

2. **Manual Deployment:**
   ```bash
   # Build for production
   npm run build
   
   # Deploy to GitHub Pages (if configured)
   npm run deploy
   ```

#### Environment Configuration

- **Production:** Environment variables are set in GitHub Actions workflow
- **Development:** Copy `.env.example` to `.env.local` and configure

### Local Development with Production API

To test the frontend with production APIs locally:

1. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://lynzm5kprh.execute-api.ap-south-1.amazonaws.com/prod
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## 🔧 Troubleshooting

1. **Images not loading:**

   - Verify image URLs are HTTPS
   - Check base path configuration

2. **Styles not applying:**

   - Clear browser cache
   - Rebuild the project

3. **Deployment issues:**
   - Check GitHub Actions logs
   - Verify repository settings
   - Ensure base path is correct

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - See LICENSE file for details
