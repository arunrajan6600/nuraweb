"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Github, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function Footer() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    // In a real app, you'd send this to your API
    console.log(`Subscribing email: ${email}`);
    toast.success("Thanks for subscribing! Check your email to confirm.");
    form.reset();
  };

  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-12 sm:grid-cols-2 sm:gap-16">
          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Stay Connected</h3>
            <p className="text-muted-foreground max-w-md">
              Subscribe to our newsletter for updates on new projects and
              articles.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex max-w-sm space-x-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </Form>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Follow Me</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link
                  href="https://twitter.com/username"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link
                  href="https://github.com/username"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link
                  href="https://instagram.com/username"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link
                  href="https://linkedin.com/in/username"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="mailto:contact@example.com">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Arun Nura. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
