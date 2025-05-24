"use client"

import type React from "react"

// Shadcn UI toast hook implementation
import { useEffect, useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toasts: ToasterToast[] = []

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: Toast) => {
    toasts.forEach((t) => {
      if (t.id === id) {
        t.title = props.title
        t.description = props.description
        t.action = props.action
        t.variant = props.variant
      }
    })
  }

  const dismiss = () => {
    toasts.forEach((t) => {
      if (t.id === id) {
        // Remove toast after delay
        setTimeout(() => {
          const index = toasts.findIndex((t) => t.id === id)
          if (index !== -1) {
            toasts.splice(index, 1)
          }
        }, TOAST_REMOVE_DELAY)
      }
    })
  }

  toasts.push({
    id,
    title: props.title,
    description: props.description,
    action: props.action,
    variant: props.variant,
  })

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        toasts.forEach((t) => {
          if (t.id === toastId) {
            // Remove toast after delay
            setTimeout(() => {
              const index = toasts.findIndex((t) => t.id === toastId)
              if (index !== -1) {
                toasts.splice(index, 1)
              }
            }, TOAST_REMOVE_DELAY)
          }
        })
      }
    },
    toasts: mounted ? toasts : [],
  }
}

export { useToast, toast }
