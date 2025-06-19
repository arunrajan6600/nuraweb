"use client";

import { Post } from "@/types/post";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ThumbnailCell } from "./thumbnail-cell";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRef, useEffect } from "react";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact";
}

function getPreviewContent(post: Post) {
  const markdownCell = post.cells.find((cell) => cell.type === "markdown");
  if (!markdownCell) return "";

  const content = markdownCell.content as string;
  const words = content.split(" ");
  return words.slice(0, 50).join(" ") + (words.length > 50 ? "..." : "");
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const formattedDate = formatDistance(new Date(post.updatedAt), new Date(), {
    addSuffix: true,
  });
  const previewContent = getPreviewContent(post);
  const isCompact = variant === "compact";

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleMouseEnter = () => {
      if (isHovering.current) return; // Prevent duplicate events
      isHovering.current = true;

      // Clear any existing card hover effects first
      window.dispatchEvent(
        new CustomEvent("cardHover", {
          detail: { type: "leave" },
        })
      );

      // Small delay to ensure cleanup, then apply new effect
      setTimeout(() => {
        const rect = cardElement.getBoundingClientRect();

        // Account for scroll position to get absolute position relative to the document
        const scrollX =
          window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY =
          window.pageYOffset || document.documentElement.scrollTop;

        window.dispatchEvent(
          new CustomEvent("cardHover", {
            detail: {
              type: "enter",
              cardId: post.id,
              bounds: {
                left: rect.left + scrollX,
                top: rect.top + scrollY,
                right: rect.right + scrollX,
                bottom: rect.bottom + scrollY,
                width: rect.width,
                height: rect.height,
              },
            },
          })
        );
      }, 10);
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      window.dispatchEvent(
        new CustomEvent("cardHover", {
          detail: {
            type: "leave",
            cardId: post.id,
          },
        })
      );
    };

    // Throttled scroll handler for better performance
    const handleScroll = () => {
      if (!isHovering.current) return;

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Throttle to run at most every 16ms (60fps)
      scrollTimeout = setTimeout(() => {
        if (!isHovering.current) return;

        const rect = cardElement.getBoundingClientRect();
        const isInViewport =
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0;

        if (!isInViewport) {
          // If card is out of viewport, clear the effect
          isHovering.current = false;
          window.dispatchEvent(
            new CustomEvent("cardHover", {
              detail: {
                type: "leave",
                cardId: post.id,
              },
            })
          );
        } else {
          // Card is still in viewport and being hovered, update coordinates
          const scrollX =
            window.pageXOffset || document.documentElement.scrollLeft;
          const scrollY =
            window.pageYOffset || document.documentElement.scrollTop;

          window.dispatchEvent(
            new CustomEvent("cardHover", {
              detail: {
                type: "update", // New event type for coordinate updates
                cardId: post.id,
                bounds: {
                  left: rect.left + scrollX,
                  top: rect.top + scrollY,
                  right: rect.right + scrollX,
                  bottom: rect.bottom + scrollY,
                  width: rect.width,
                  height: rect.height,
                },
              },
            })
          );
        }
      }, 16);
    };

    cardElement.addEventListener("mouseenter", handleMouseEnter);
    cardElement.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      if (isHovering.current) {
        window.dispatchEvent(
          new CustomEvent("cardHover", {
            detail: {
              type: "leave",
              cardId: post.id,
            },
          })
        );
      }
      cardElement.removeEventListener("mouseenter", handleMouseEnter);
      cardElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [post.id]);

  return (
    <Card
      ref={cardRef}
      className="w-full transition-all duration-500 hover:shadow-md dark:hover:shadow-primary/5 hover:scale-[1.005] transform-gpu"
    >
      <Link href={`/post/${post.id}`} className="block">
        <CardContent className="p-8 md:p-10 space-y-8">
          <div className="space-y-4">
            <CardTitle className="transition-colors hover:text-primary text-xl font-bold leading-tight">
              {post.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              {formattedDate}
            </p>
          </div>

          {post.thumbnail && (
            <ThumbnailCell
              content={post.thumbnail}
              className={isCompact ? "h-48" : "h-64 md:h-72"}
            />
          )}

          {!isCompact && previewContent && (
            <p className="text-muted-foreground line-clamp-3 leading-relaxed">
              {previewContent}
            </p>
          )}

          <div className="flex items-center justify-end pt-4">
            <Button variant="ghost" size="sm" className="group font-medium">
              Read more{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
