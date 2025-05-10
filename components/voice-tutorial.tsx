"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mic, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVoiceCommands } from "@/contexts/voice-command-context"

export function VoiceTutorial() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const { isSupported, toggleListening, isListening } = useVoiceCommands()
  const hasCheckedLocalStorage = useRef(false)

  useEffect(() => {
    // Only run this effect once
    if (hasCheckedLocalStorage.current) return
    hasCheckedLocalStorage.current = true

    // Check if this is the first visit
    const hasSeenTutorial = localStorage.getItem("voice-tutorial-seen")

    if (!hasSeenTutorial && isSupported) {
      // Wait a bit before showing the tutorial
      const timer = setTimeout(() => {
        setShowTutorial(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isSupported])

  const closeTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem("voice-tutorial-seen", "true")
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      closeTutorial()
    }
  }

  const steps = [
    {
      title: "Voice Navigation Available",
      content: "This website supports voice commands for hands-free navigation. Would you like to learn how to use it?",
      action: () => {},
    },
    {
      title: "How It Works",
      content: "Click the microphone button in the bottom right corner to start listening for voice commands.",
      action: () => {},
    },
    {
      title: "Try These Commands",
      content:
        "Say 'go to services', 'show projects', or 'contact us' to navigate the site. Say 'toggle theme' to switch between light and dark mode.",
      action: () => {},
    },
    {
      title: "Form Filling",
      content:
        "You can also fill out forms using your voice. Say 'fill form' to start, then use commands like 'first name' or 'message' to fill specific fields.",
      action: () => {},
    },
    {
      title: "Ready to Try?",
      content: "Click the button below to enable voice commands and start exploring the site hands-free!",
      action: () => {
        if (!isListening) {
          toggleListening()
        }
      },
    },
  ]

  if (!showTutorial) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={closeTutorial}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
            <Button variant="ghost" size="icon" onClick={closeTutorial} aria-label="Close tutorial">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground">{steps[currentStep].content}</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-6 rounded-full ${index === currentStep ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={() => {
                    steps[currentStep].action()
                    closeTutorial()
                  }}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Enable Voice Commands
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
