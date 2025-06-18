import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-6">About</h1>
        <Card>
          <CardContent className="p-6">
            <div className="prose dark:prose-invert">
              <h2>
                {"<"}arun nura{">"}
              </h2>
              <p>Multi-disciplinary art practitioner based in [Location].</p>

              <h3>Background</h3>
              <p>
                This is a placeholder for the artist&apos;s background
                information. It will include details about their artistic
                journey, education, and professional experience.
              </p>

              <h3>Contact</h3>
              <p>Feel free to reach out for collaborations or inquiries:</p>
              <ul>
                <li>
                  Email:{" "}
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="mailto:arunr6600@yahoo.com">arunr6600@yahoo.com</a>
                  </Button>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
