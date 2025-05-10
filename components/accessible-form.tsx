"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AccessibilityAnnouncer } from "@/components/accessibility-announcer"
import { useVoiceCommands } from "@/contexts/voice-command-context"
import { useVoiceTyping } from "@/hooks/use-voice-typing"
import { Mic } from "lucide-react"

export function AccessibleContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<string | null>(null)
  const { isListening, addCommand, removeCommand } = useVoiceCommands()

  // Voice typing hooks for each field
  const firstNameVoice = useVoiceTyping({
    fieldId: "firstName",
    commandPhrases: ["first name", "my name is", "name"],
  })

  const emailVoice = useVoiceTyping({
    fieldId: "email",
    commandPhrases: ["email", "my email is", "email address"],
  })

  const messageVoice = useVoiceTyping({
    fieldId: "message",
    commandPhrases: ["message", "my message is", "project details"],
  })

  // Add form submission command
  useEffect(() => {
    const submitCommand = {
      phrases: ["submit form", "send message", "submit message"],
      action: () => {
        const form = formRef.current
        if (form) {
          form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
        }
      },
      description: "Submit the contact form",
    }

    addCommand(submitCommand)

    return () => {
      removeCommand(submitCommand.phrases)
    }
  }, [addCommand, removeCommand])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formState.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formState.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formState.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setFormStatus("Please correct the errors in the form")
      return
    }

    setIsSubmitting(true)
    setFormStatus("Submitting your message...")

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFormState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        projectType: "",
        message: "",
      })
      setFormStatus("Your message has been sent successfully!")
    } catch (error) {
      setFormStatus("There was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4" id="contact-form-heading">
        Send us a Message
      </h3>

      <AccessibilityAnnouncer message={formStatus || ""} />

      {formStatus && !isSubmitting && (
        <div
          className={`mb-4 p-3 rounded-md ${formStatus.includes("error") ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"}`}
          role="status"
          aria-live="polite"
        >
          {formStatus}
        </div>
      )}

      <form ref={formRef} className="space-y-4" onSubmit={handleSubmit} aria-labelledby="contact-form-heading">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between"
            >
              <span>
                First name{" "}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
              </span>
              {isListening && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`h-6 px-2 ${firstNameVoice.isTyping ? "text-red-500" : "text-blue-500"}`}
                  onClick={() => (firstNameVoice.isTyping ? firstNameVoice.stopTyping() : firstNameVoice.startTyping())}
                  aria-label={
                    firstNameVoice.isTyping ? "Stop voice typing for first name" : "Start voice typing for first name"
                  }
                >
                  <Mic className="h-3 w-3 mr-1" />
                  {firstNameVoice.isTyping ? "Stop" : "Say it"}
                </Button>
              )}
            </label>
            <input
              id="firstName"
              name="firstName"
              value={formState.firstName}
              onChange={handleChange}
              className={`flex h-10 w-full rounded-md border ${errors.firstName ? "border-red-500 dark:border-red-700" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200`}
              placeholder="John"
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors.firstName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              value={formState.lastName}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between"
          >
            <span>
              Email{" "}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
            </span>
            {isListening && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`h-6 px-2 ${emailVoice.isTyping ? "text-red-500" : "text-blue-500"}`}
                onClick={() => (emailVoice.isTyping ? emailVoice.stopTyping() : emailVoice.startTyping())}
                aria-label={emailVoice.isTyping ? "Stop voice typing for email" : "Start voice typing for email"}
              >
                <Mic className="h-3 w-3 mr-1" />
                {emailVoice.isTyping ? "Stop" : "Say it"}
              </Button>
            )}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            className={`flex h-10 w-full rounded-md border ${errors.email ? "border-red-500 dark:border-red-700" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200`}
            placeholder="john.doe@example.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500 dark:text-red-400 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formState.phone}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="projectType"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formState.projectType}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
          >
            <option value="">Select Project Type</option>
            <option value="substation-installation">Substation Installation</option>
            <option value="maintenance-repair">Maintenance & Repair</option>
            <option value="upgrades-modernization">Upgrades & Modernization</option>
            <option value="testing-commissioning">Testing & Commissioning</option>
            <option value="consultancy">Consultancy Services</option>
            <option value="power-distribution">Power Distribution</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between"
          >
            <span>
              Message{" "}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
            </span>
            {isListening && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`h-6 px-2 ${messageVoice.isTyping ? "text-red-500" : "text-blue-500"}`}
                onClick={() => (messageVoice.isTyping ? messageVoice.stopTyping() : messageVoice.startTyping())}
                aria-label={messageVoice.isTyping ? "Stop voice typing for message" : "Start voice typing for message"}
              >
                <Mic className="h-3 w-3 mr-1" />
                {messageVoice.isTyping ? "Stop" : "Say it"}
              </Button>
            )}
          </label>
          <textarea
            id="message"
            name="message"
            value={formState.message}
            onChange={handleChange}
            className={`flex min-h-[120px] w-full rounded-md border ${errors.message ? "border-red-500 dark:border-red-700" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200`}
            placeholder="Tell us about your project requirements..."
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          ></textarea>
          {errors.message && (
            <p id="message-error" className="text-sm text-red-500 dark:text-red-400 mt-1">
              {errors.message}
            </p>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Fields marked with{" "}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>{" "}
            <span className="sr-only">asterisk</span> are required
          </p>
        </div>

        <Button
          type="submit"
          className="w-full relative overflow-hidden group"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          <span className="relative z-10">{isSubmitting ? "Sending Message..." : "Send Message"}</span>
          <span className="absolute inset-0 bg-primary-foreground opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
        </Button>

        {isListening && (
          <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-300">Voice Commands Available:</p>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>Say "first name" to fill your name</li>
              <li>Say "email" to fill your email</li>
              <li>Say "message" to fill your message</li>
              <li>Say "submit form" to send your message</li>
            </ul>
          </div>
        )}
      </form>
    </div>
  )
}
