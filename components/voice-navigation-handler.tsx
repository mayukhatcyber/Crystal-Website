"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useVoiceCommands } from "@/contexts/voice-command-context"

export function VoiceNavigationHandler() {
  const { addCommand, removeCommand } = useVoiceCommands()
  const router = useRouter()
  const { setTheme } = useTheme()

  useEffect(() => {
    const navigationCommands = [
      {
        phrases: ["go home", "go to home", "home page", "home section"],
        action: () => {
          window.scrollTo({ top: 0, behavior: "smooth" })
        },
        description: "Navigate to the home section",
      },
      {
        phrases: ["services", "go to services", "show services", "services section"],
        action: () => {
          document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
        },
        description: "Navigate to the services section",
      },
      {
        phrases: ["projects", "go to projects", "show projects", "projects section"],
        action: () => {
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
        },
        description: "Navigate to the projects section",
      },
      {
        phrases: ["about", "about us", "go to about", "about section"],
        action: () => {
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
        },
        description: "Navigate to the about section",
      },
      {
        phrases: ["contact", "contact us", "go to contact", "contact section"],
        action: () => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
        },
        description: "Navigate to the contact section",
      },
      {
        phrases: ["get a quote", "request quote", "quote"],
        action: () => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
          // Focus on the first form field
          setTimeout(() => {
            const firstInput = document.querySelector("#contact form input") as HTMLElement
            if (firstInput) firstInput.focus()
          }, 500)
        },
        description: "Navigate to the contact form",
      },
      {
        phrases: ["dark mode", "switch to dark", "enable dark mode"],
        action: () => {
          setTheme("dark")
        },
        description: "Switch to dark mode",
      },
      {
        phrases: ["light mode", "switch to light", "enable light mode"],
        action: () => {
          setTheme("light")
        },
        description: "Switch to light mode",
      },
      {
        phrases: ["toggle theme", "switch theme", "change theme"],
        action: () => {
          setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")
        },
        description: "Toggle between light and dark mode",
      },
    ]

    // Add navigation commands
    navigationCommands.forEach((command) => addCommand(command))

    return () => {
      // Clean up commands
      navigationCommands.forEach((command) => removeCommand(command.phrases))
    }
  }, [addCommand, removeCommand, router, setTheme])

  return null // This is a non-visual component
}
