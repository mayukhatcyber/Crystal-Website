"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVoiceCommands } from "@/contexts/voice-command-context"
import { VoiceCommandHelp } from "@/components/voice-command-help"

export function VoiceCommandButton() {
  const { isListening, toggleListening, isSupported, error } = useVoiceCommands()
  const [showHelp, setShowHelp] = useState(false)

  if (!isSupported) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="mb-2"
          >
            <VoiceCommandHelp onClose={() => setShowHelp(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowHelp(!showHelp)}
          className="rounded-full bg-background shadow-md"
          aria-label="Voice command help"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        <Button
          onClick={toggleListening}
          className={`rounded-full shadow-md ${
            isListening ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          aria-label={isListening ? "Stop voice commands" : "Start voice commands"}
          aria-pressed={isListening}
        >
          <span className="sr-only">{isListening ? "Stop voice commands" : "Start voice commands"}</span>
          {isListening ? (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="flex items-center gap-2"
            >
              <MicOff className="h-5 w-5 mr-2" />
              Stop Listening
            </motion.div>
          ) : (
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 mr-2" />
              Start Voice Commands
            </div>
          )}
        </Button>
      </div>

      {error && <div className="mt-2 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-md">{error}</div>}
    </div>
  )
}
