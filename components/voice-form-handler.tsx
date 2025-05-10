"use client"

import { useEffect, useRef } from "react"
import { useVoiceCommands } from "@/contexts/voice-command-context"

export function VoiceFormHandler() {
  const { addCommand, removeCommand, isListening } = useVoiceCommands()
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    // Find the form element
    const form = document.querySelector("form") as HTMLFormElement
    if (form) {
      formRef.current = form
    }

    // Commands for form filling
    const formCommands = [
      {
        phrases: ["fill form", "fill the form", "complete form"],
        action: () => {
          startFormFilling()
        },
        description: "Start filling out the contact form",
      },
      {
        phrases: ["submit form", "send form", "send message"],
        action: () => {
          submitForm()
        },
        description: "Submit the contact form",
      },
    ]

    // Add form commands
    formCommands.forEach((command) => addCommand(command))

    return () => {
      // Clean up commands
      formCommands.forEach((command) => removeCommand(command.phrases))
    }
  }, [addCommand, removeCommand])

  const startFormFilling = () => {
    if (!formRef.current) return

    // Focus on the first input
    const firstInput = formRef.current.querySelector("input, textarea, select") as HTMLElement
    if (firstInput) {
      firstInput.focus()

      // Add field-specific commands
      addFieldCommands()
    }
  }

  const submitForm = () => {
    if (!formRef.current) return

    // Submit the form
    formRef.current.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
  }

  const addFieldCommands = () => {
    // These would be more sophisticated in a real implementation
    // For now, just demonstrating the concept
    const fieldCommands = [
      {
        phrases: ["my name is", "first name"],
        action: () => {
          const firstNameInput = document.getElementById("firstName") as HTMLInputElement
          if (firstNameInput) {
            firstNameInput.focus()
          }
        },
        description: "Focus on first name field",
      },
      {
        phrases: ["my email is", "email"],
        action: () => {
          const emailInput = document.getElementById("email") as HTMLInputElement
          if (emailInput) {
            emailInput.focus()
          }
        },
        description: "Focus on email field",
      },
      {
        phrases: ["my message is", "message"],
        action: () => {
          const messageInput = document.getElementById("message") as HTMLTextAreaElement
          if (messageInput) {
            messageInput.focus()
          }
        },
        description: "Focus on message field",
      },
    ]

    fieldCommands.forEach((command) => addCommand(command))
  }

  return null // This is a non-visual component
}
