"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useVoiceCommands } from "@/contexts/voice-command-context"

export function VoiceFeedback() {
  const { isListening, transcript } = useVoiceCommands()
  const [showTranscript, setShowTranscript] = useState(false)
  const [displayText, setDisplayText] = useState("")
  const lastTranscriptRef = useRef("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (transcript && isListening && transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript
      setDisplayText(transcript)
      setShowTranscript(true)

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // Set a new timer
      timerRef.current = setTimeout(() => {
        setShowTranscript(false)
      }, 3000)
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [transcript, isListening])

  return (
    <AnimatePresence>
      {isListening && showTranscript && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm border rounded-lg px-4 py-2 shadow-lg z-50"
        >
          <p className="text-center">
            <span className="text-muted-foreground">I heard: </span>
            <span className="font-medium">{displayText}</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
