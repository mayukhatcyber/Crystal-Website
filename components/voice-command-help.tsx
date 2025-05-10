"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface VoiceCommandHelpProps {
  onClose: () => void
}

export function VoiceCommandHelp({ onClose }: VoiceCommandHelpProps) {
  const commands = [
    { command: "Go to home", description: "Navigate to the home section" },
    { command: "Show services", description: "Navigate to the services section" },
    { command: "Show projects", description: "Navigate to the projects section" },
    { command: "About us", description: "Navigate to the about section" },
    { command: "Contact", description: "Navigate to the contact section" },
    { command: "Get a quote", description: "Navigate to the contact form" },
    { command: "Toggle theme", description: "Switch between light and dark mode" },
    { command: "Fill form", description: "Start filling out the contact form" },
    { command: "Submit form", description: "Submit the contact form" },
    { command: "Stop listening", description: "Turn off voice commands" },
  ]

  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Voice Commands</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close help">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Say these commands to navigate the site</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {commands.map((cmd, index) => (
            <li key={index} className="flex justify-between">
              <span className="font-medium text-blue-600 dark:text-blue-400">"{cmd.command}"</span>
              <span className="text-muted-foreground">{cmd.description}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
