import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, GraduationCap, Mail, FileText, Github, Linkedin, Twitter } from "lucide-react"

export const metadata = {
  title: "About | Surya Narayanan",
  description: "Learn more about Surya Narayanan, skills, experience, and background.",
}

const skills = [
  { name: "React", level: "expert" },
  { name: "Next.js", level: "expert" },
  { name: "TypeScript", level: "expert" },
  { name: "Node.js", level: "intermediate" },
  { name: "UI/UX Design", level: "intermediate" },
  { name: "GraphQL", level: "intermediate" },
  { name: "AWS", level: "beginner" },
]

const experience = [
  {
    title: "Senior Frontend Developer",
    company: "Tech Company",
    description:
      "Led the development of the company's main product, improving performance by 40% and implementing new features that increased user engagement.",
    duration: "2021 - Present",
  },
  {
    title: "Frontend Developer",
    company: "Digital Agency",
    description:
      "Worked on various client projects using React, Next.js, and TypeScript. Collaborated with designers to implement pixel-perfect UIs.",
    duration: "2018 - 2021",
  },
  {
    title: "Junior Developer",
    company: "Startup",
    description:
      "Assisted in building the company's web application from scratch. Learned modern web development practices and tools.",
    duration: "2016 - 2018",
  },
]

const education = [
  {
    degree: "Master of Computer Science",
    institution: "University Name",
    duration: "2014 - 2016",
  },
  {
    degree: "Bachelor of Engineering",
    institution: "University Name",
    duration: "2010 - 2014",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* About Section */}
        <section className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Hi, I'm Surya Narayanan, a passionate web developer and designer with over 5 years of experience
                building modern web applications.
              </p>
              <p>
                I specialize in frontend development with React, Next.js, and TypeScript, but I'm also comfortable
                working with backend technologies. I enjoy creating intuitive user interfaces and solving complex
                problems.
              </p>
              <p>
                When I'm not coding, you can find me writing blog posts, contributing to open-source projects, or
                exploring new technologies.
              </p>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="#contact">Get in Touch</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/resume.pdf" target="_blank">
                  <FileText className="mr-2 h-4 w-4" />
                  Resume
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-square rounded-full overflow-hidden border-4 border-background shadow-xl">
            <Image src="/diverse-person-portrait.png" alt="Surya Narayanan" fill className="object-cover" priority />
          </div>
        </section>

        {/* Skills Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Card key={skill.name}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <h3 className="font-medium">{skill.name}</h3>
                  <div className="text-sm text-muted-foreground capitalize mt-1">{skill.level}</div>
                  <div className="w-full mt-2 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: skill.level === "expert" ? "100%" : skill.level === "intermediate" ? "66%" : "33%",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
          <div className="space-y-6">
            {experience.map((job, index) => (
              <div key={index} className="flex gap-4">
                <div className="mt-1">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl">{job.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{job.company}</span>
                    <span className="mx-2">•</span>
                    <span>{job.duration}</span>
                  </div>
                  <p className="text-muted-foreground">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Education</h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="flex gap-4">
                <div className="mt-1">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-xl">{edu.degree}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{edu.institution}</span>
                    <span className="mx-2">•</span>
                    <span>{edu.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="space-y-6 scroll-mt-16">
          <h2 className="text-3xl font-bold tracking-tight">Contact</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Feel free to reach out if you have any questions, want to collaborate, or just want to say hi!
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:hello@example.com" className="hover:text-primary">
                    hello@example.com
                  </a>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Link
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <form className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <input
                      id="subject"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your message"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
