"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

type CommandAction = () => void

interface Command {
  phrases: string[]
  action: CommandAction
  description: string
}

interface VoiceCommandContextType {
  isListening: boolean
  toggleListening: () => void
  addCommand: (command: Command) => void
  removeCommand: (phrases: string[]) => void
  transcript: string
  isSupported: boolean
  error: string | null
}

const VoiceCommandContext = createContext<VoiceCommandContextType | undefined>(undefined)

export function useVoiceCommands() {
  const context = useContext(VoiceCommandContext)
  if (context === undefined) {
    throw new Error("useVoiceCommands must be used within a VoiceCommandProvider")
  }
  return context
}

export function VoiceCommandProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [commands, setCommands] = useState<Command[]>([])

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const shouldRestartRef = useRef(false)

  // Check if browser supports speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
      } else {
        setError("Speech recognition is not supported in this browser")
      }
    }
  }, [])

  // Initialize recognition instance
  const initializeRecognition = useCallback(() => {
    if (!isSupported || typeof window === "undefined") return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      const last = event.results.length - 1
      const text = event.results[last][0].transcript.trim().toLowerCase()

      setTranscript(text)

      // Check if the transcript matches any command
      for (const command of commands) {
        for (const phrase of command.phrases) {
          if (text.includes(phrase.toLowerCase())) {
            command.action()
            return
          }
        }
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      setError(`Error: ${event.error}`)
      setIsListening(false)
      shouldRestartRef.current = false
    }

    recognition.onend = () => {
      // Restart if we're supposed to be listening
      if (shouldRestartRef.current) {
        try {
          recognition.start()
        } catch (err) {
          console.error("Failed to restart speech recognition:", err)
          setError("Failed to restart speech recognition")
          setIsListening(false)
          shouldRestartRef.current = false
        }
      } else {
        setIsListening(false)
      }
    }

    recognitionRef.current = recognition
    return recognition
  }, [isSupported, commands])

  const toggleListening = useCallback(() => {
    if (!isSupported) return

    if (!isListening) {
      // Start listening
      const recognition = recognitionRef.current || initializeRecognition()
      if (!recognition) return

      try {
        recognition.start()
        shouldRestartRef.current = true
        setIsListening(true)
        setError(null)
      } catch (err) {
        console.error("Failed to start speech recognition:", err)
        setError("Failed to start speech recognition")
      }
    } else {
      // Stop listening
      if (recognitionRef.current) {
        shouldRestartRef.current = false
        recognitionRef.current.stop()
      }
      setIsListening(false)
    }
  }, [isListening, isSupported, initializeRecognition])

  const addCommand = useCallback((command: Command) => {
    setCommands((prev) => {
      // Check if command already exists to avoid duplicates
      const exists = prev.some((cmd) => cmd.phrases.some((phrase) => command.phrases.includes(phrase)))
      if (exists) return prev
      return [...prev, command]
    })
  }, [])

  const removeCommand = useCallback((phrases: string[]) => {
    setCommands((prev) => prev.filter((cmd) => !cmd.phrases.some((p) => phrases.includes(p))))
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        shouldRestartRef.current = false
        recognitionRef.current.stop()
      }
    }
  }, [])

  const value = {
    isListening,
    toggleListening,
    addCommand,
    removeCommand,
    transcript,
    isSupported,
    error,
  }

  return <VoiceCommandContext.Provider value={value}>{children}</VoiceCommandContext.Provider>
}
