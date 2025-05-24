import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Update the formatDate function to handle both Date objects and strings
// and add error handling to prevent crashes with invalid dates

export function formatDate(date: Date | string): string {
  try {
    // If date is a string, convert it to a Date object
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date"
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateObj)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}
