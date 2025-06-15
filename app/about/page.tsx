import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <section className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">About</h1>
        <Card className="bg-zinc-900 border-zinc-800 p-6 md:p-8 mb-12">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
            arun nura is a kerala-based multidisciplinary art practitioner
            specialising in visual practices, experimental films and theatre
            performances. he graduated as a mechanical engineer, and his areas
            of interest widened into anthropological studies, films, performance
            arts and ai-code art.{" "}
            <Link
              href="https://www.instagram.com/arun.nura"
              className="text-blue-400 hover:text-blue-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              @moodupani
            </Link>
          </p>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Key Concepts</h2>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-zinc-800 rounded-full text-sm">
                Sporadic Cinema
              </span>
              <span className="px-4 py-2 bg-zinc-800 rounded-full text-sm">
                Pseudo-futurism
              </span>
              <span className="px-4 py-2 bg-zinc-800 rounded-full text-sm">
                Process-ing
              </span>
            </div>
          </div>
        </Card>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-square">
            <Image
              src="/images/manKEY.png"
              alt="Visual Art Work 1"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="/images/monKEY.png"
              alt="Visual Art Work 2"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Download CV Section */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link
              href="https://drive.google.com/file/d/15wvnriDqfn0tJTHynQ5Hs7UaNQc0eu3Z/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV and Resume
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
