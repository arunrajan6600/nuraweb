import { getPosts } from "@/lib/posts"
import { AdminPanel } from "@/components/admin/admin-panel"
import { HeroSection } from "@/components/landing/hero-section"
import { PostsSection } from "@/components/landing/posts-section"
import { Footer } from "@/components/landing/footer"

export default async function Home() {
  const allPosts = await getPosts()
  const publishedPosts = allPosts.filter((post) => post.status === "published")
  const isAdminEnabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === "true"

  if (isAdminEnabled) {
    return (
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8">My Personal Website</h1>
        <AdminPanel initialPosts={allPosts} />
      </main>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <PostsSection posts={publishedPosts} />
      </main>
      <Footer />
    </div>
  )
}
