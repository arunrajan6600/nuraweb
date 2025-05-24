"use client"

import type React from "react"
import { createContext, useContext } from "react"

type ThemeProviderState = {
  theme: "dark"
}

const initialState: ThemeProviderState = {
  theme: "dark",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProviderContext.Provider {...props} value={initialState}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
