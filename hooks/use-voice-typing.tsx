"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useVoiceCommands } from "@/contexts/voice-command-context"

interface UseVoiceTypingProps {
  fieldId: string
  commandPhrases: string[]
  onComplete?: () => void
}

export function useVoiceTyping({ fieldId, commandPhrases, onComplete }: UseVoiceTypingProps) {
  const [isTyping, setIsTyping] = useState(false)
  const { addCommand, removeCommand, transcript, isListening } = useVoiceCommands()
  const lastTranscriptRef = useRef("")
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  // Start typing in the field
  const startTyping = useCallback(() => {
    setIsTyping(true)

    // Focus the field
    const field = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement
    if (field) {
      field.focus()
      fieldRef.current = field
    }
  }, [fieldId])

  // Stop typing in the field
  const stopTyping = useCallback(() => {
    setIsTyping(false)
    fieldRef.current = null
    if (onComplete) {
      onComplete()
    }
  }, [onComplete])

  // Add command to start typing in this field
  useEffect(() => {
    const command = {
      phrases: commandPhrases,
      action: startTyping,
      description: `Focus on ${fieldId} field`,
    }

    addCommand(command)

    return () => {
      removeCommand(commandPhrases)
    }
  }, [addCommand, removeCommand, commandPhrases, startTyping, fieldId])

  // Add command to stop typing
  useEffect(() => {
    if (isTyping) {
      const stopCommand = {
        phrases: ["stop typing", "done typing", "finish typing"],
        action: stopTyping,
        description: "Stop voice typing",
      }

      addCommand(stopCommand)

      return () => {
        removeCommand(["stop typing", "done typing", "finish typing"])
      }
    }
  }, [isTyping, addCommand, removeCommand, stopTyping])

  // Update the field value when transcript changes
  useEffect(() => {
    if (isTyping && isListening && transcript && transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript

      // Use a timeout to avoid immediate re-renders
      setTimeout(() => {
        const field = fieldRef.current || (document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement)
        if (field) {
          // For simplicity, we're just setting the value directly
          field.value = transcript

          // Trigger input event to update form state
          const event = new Event("input", { bubbles: true })
          field.dispatchEvent(event)
        }
      }, 0)
    }
  }, [transcript, isTyping, isListening, fieldId])

  return { isTyping, startTyping, stopTyping }
}
